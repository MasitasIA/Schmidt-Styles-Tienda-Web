from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.responses import RedirectResponse
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session, joinedload
from database import engine, Base, SessionLocal
import models
from fastapi.middleware.cors import CORSMiddleware
import schemas

import os
from dotenv import load_dotenv

# Verificación de ADMIN
from sqladmin.authentication import AuthenticationBackend
from starlette.requests import Request
from sqladmin import Admin, ModelView

# Importaciones para Autenticación Tradicional (JWT y Contraseñas)
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta

load_dotenv()

app = FastAPI(
    title="Schmidt Styles API 👕",
    description="Panel interno para la gestión de inventario, talles y colores.",
    version="1.0.0",
    contact={
        "name": "Soporte Schmidt Styles - MasitasIA",
        "email": "nereoschmidt@gmail.com",
    },
    swagger_ui_parameters={"defaultModelsExpandDepth": -1}
)

# --- CONFIGURACIÓN DE CORS (Permisos para el Frontend) ---
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def no_cache_admin(request: Request, call_next):
    response = await call_next(request)
    if request.url.path.startswith("/admin"):
        response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate, max-age=0"
        response.headers["Pragma"] = "no-cache"
        response.headers["Expires"] = "0"
    return response


Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/")
def read_root():
    return RedirectResponse(url="/admin")

# --- RUTAS PARA TALLES ---


@app.post("/talles/", response_model=schemas.TalleResponse, tags=["Talles"])
def crear_talle(talle: schemas.TalleCreate, db: Session = Depends(get_db)):
    db_talle = models.Talle(nombre=talle.nombre)
    db.add(db_talle)
    db.commit()
    db.refresh(db_talle)
    return db_talle


@app.get("/talles/", response_model=list[schemas.TalleResponse], tags=["Talles"])
def leer_talles(db: Session = Depends(get_db)):
    return db.query(models.Talle).all()

# --- RUTAS PARA COLORES ---


@app.post("/colores/", response_model=schemas.ColorResponse, tags=["Colores"])
def crear_color(color: schemas.ColorCreate, db: Session = Depends(get_db)):
    db_color = models.Color(nombre=color.nombre)
    db.add(db_color)
    db.commit()
    db.refresh(db_color)
    return db_color


@app.get("/colores/", response_model=list[schemas.ColorResponse], tags=["Colores"])
def leer_colores(db: Session = Depends(get_db)):
    return db.query(models.Color).all()

# --- RUTAS PARA PRODUCTOS ---


@app.post("/productos/", response_model=schemas.ProductoResponse, tags=["Productos"])
def crear_producto(producto: schemas.ProductoCreate, db: Session = Depends(get_db)):
    db_producto = models.Producto(**producto.model_dump())
    db.add(db_producto)
    db.commit()
    db.refresh(db_producto)
    return db_producto


@app.get("/productos/", response_model=list[schemas.ProductoResponse], tags=["Productos"])
def leer_productos(db: Session = Depends(get_db)):
    return db.query(models.Producto).options(joinedload(models.Producto.imagenes)).all()


# --- CONFIGURACIÓN DE AUTENTICACIÓN TRADICIONAL PARA COMPRADORES ---

SECRET_KEY = os.getenv("JWT_SECRET_KEY", "clave_de_respaldo_compradores")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


def verificar_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


def crear_token_acceso(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


@app.post("/registro/", response_model=schemas.UsuarioResponse, tags=["Autenticación Compradores"])
def registrar_usuario(usuario: schemas.UsuarioCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.Usuario).filter(
        models.Usuario.email == usuario.email).first()
    if db_user:
        raise HTTPException(
            status_code=400, detail="El email ya está registrado")

    hashed_password = get_password_hash(usuario.password)
    nuevo_usuario = models.Usuario(
        nombre=usuario.nombre,
        email=usuario.email,
        password_hash=hashed_password
    )
    db.add(nuevo_usuario)
    db.commit()
    db.refresh(nuevo_usuario)
    return nuevo_usuario


@app.post("/login/", response_model=schemas.Token, tags=["Autenticación Compradores"])
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    usuario = db.query(models.Usuario).filter(
        models.Usuario.email == form_data.username).first()
    if not usuario or not verificar_password(form_data.password, usuario.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email o contraseña incorrectos",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = crear_token_acceso(data={"sub": usuario.email})
    return {"access_token": access_token, "token_type": "bearer"}

# --- LÓGICA DE USUARIO ACTUAL Y FAVORITOS ---


def get_usuario_actual(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(
                status_code=401, detail="Credenciales inválidas")
    except JWTError:
        raise HTTPException(status_code=401, detail="Credenciales inválidas")

    usuario = db.query(models.Usuario).filter(
        models.Usuario.email == email).first()
    if usuario is None:
        raise HTTPException(status_code=401, detail="Usuario no encontrado")
    return usuario


@app.get("/favoritos/", response_model=list[schemas.FavoritoResponse], tags=["Favoritos"])
def obtener_favoritos(usuario: models.Usuario = Depends(get_usuario_actual), db: Session = Depends(get_db)):
    favoritos = db.query(models.Favorito).filter(models.Favorito.usuario_id == usuario.id)\
        .options(joinedload(models.Favorito.producto).joinedload(models.Producto.imagenes)).all()
    return favoritos


@app.post("/favoritos/{producto_id}", tags=["Favoritos"])
def alternar_favorito(producto_id: int, usuario: models.Usuario = Depends(get_usuario_actual), db: Session = Depends(get_db)):
    fav_existente = db.query(models.Favorito).filter(
        models.Favorito.usuario_id == usuario.id,
        models.Favorito.producto_id == producto_id
    ).first()

    if fav_existente:
        db.delete(fav_existente)
        db.commit()
        return {"mensaje": "Removido de favoritos", "estado": False}
    else:
        nuevo_fav = models.Favorito(
            usuario_id=usuario.id, producto_id=producto_id)
        db.add(nuevo_fav)
        db.commit()
        return {"mensaje": "Agregado a favoritos", "estado": True}

# --- CONFIGURACIÓN DEL PANEL DE ADMINISTRADOR ---


class AdminAuth(AuthenticationBackend):
    async def login(self, request: Request) -> bool:
        form = await request.form()
        username = form.get("username")
        password = form.get("password")

        # Leemos las credenciales desde el archivo .env
        env_username = os.getenv("ADMIN_USERNAME")
        env_password = os.getenv("ADMIN_PASSWORD")

        if username == env_username and password == env_password:
            request.session.update({"token": "admin_autorizado"})
            return True

        return False

    async def logout(self, request: Request) -> bool:
        request.session.clear()
        return True

    async def authenticate(self, request: Request) -> bool:
        token = request.session.get("token")
        if not token:
            return False
        return True


# Leemos la clave secreta del admin desde el .env
secreto_admin = os.getenv("ADMIN_SECRET_KEY", "clave_de_respaldo_por_si_falla")

authentication_backend = AdminAuth(secret_key=secreto_admin)

admin = Admin(
    app,
    engine,
    title="Schmidt Styles Admin",
    authentication_backend=authentication_backend
)

# Vistas del Admin


class CategoriaAdmin(ModelView, model=models.Categoria):
    column_list = [models.Categoria.id, models.Categoria.nombre]
    icon = "fa-solid fa-tags"
    form_excluded_columns = [models.Categoria.productos]


class ProductoAdmin(ModelView, model=models.Producto):
    column_list = [models.Producto.id, models.Producto.nombre,
                   models.Producto.precio, models.Producto.categoria, models.Producto.activo]
    icon = "fa-solid fa-shirt"
    form_excluded_columns = [models.Producto.variantes,
                             models.Producto.imagenes, models.Producto.creado_en]


class TalleAdmin(ModelView, model=models.Talle):
    column_list = [models.Talle.id, models.Talle.nombre]
    icon = "fa-solid fa-ruler"
    form_excluded_columns = [models.Talle.variantes]


class ColorAdmin(ModelView, model=models.Color):
    column_list = [models.Color.id, models.Color.nombre]
    icon = "fa-solid fa-palette"
    form_excluded_columns = [models.Color.variantes]


class VarianteProductoAdmin(ModelView, model=models.VarianteProducto):
    column_list = [models.VarianteProducto.id, models.VarianteProducto.producto,
                   models.VarianteProducto.talle, models.VarianteProducto.color, models.VarianteProducto.stock]
    icon = "fa-solid fa-boxes-stacked"


class ImagenProductoAdmin(ModelView, model=models.ImagenProducto):
    column_list = [models.ImagenProducto.id,
                   models.ImagenProducto.producto, models.ImagenProducto.imagen]
    icon = "fa-solid fa-image"

# Vista de Usuarios (Compradores)


class UsuarioAdmin(ModelView, model=models.Usuario):
    column_list = [models.Usuario.id, models.Usuario.nombre,
                   models.Usuario.email, models.Usuario.creado_en]
    icon = "fa-solid fa-users"
    form_excluded_columns = [models.Usuario.creado_en]


# Registramos las vistas en el panel de administración
admin.add_view(CategoriaAdmin)
admin.add_view(ImagenProductoAdmin)
admin.add_view(ProductoAdmin)
admin.add_view(TalleAdmin)
admin.add_view(ColorAdmin)
admin.add_view(VarianteProductoAdmin)
admin.add_view(UsuarioAdmin)
