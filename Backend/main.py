from fastapi import FastAPI, Depends
from fastapi.responses import RedirectResponse
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

# Cargar variables de entorno desde el archivo .env
load_dotenv()

app = FastAPI(
    title="Schmidt Styles API 👕",
    description="Panel interno para la gestión de inventario, talles y colores.",
    version="1.0.0",
    contact={
        "name": "Soporte Schmidt Styles - MasitasIA",
        "email": "nereoschmidt@gmail.com",
    },
    # Esto oculta los "schemas" de abajo para que quede más limpio
    swagger_ui_parameters={"defaultModelsExpandDepth": -1}
)

# --- CONFIGURACIÓN DE CORS (Permisos para el Frontend) ---
# Esto permite que tu aplicación React (que correrá en el puerto 5173) hable con FastAPI (puerto 8000)
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
    # Solo aplicamos esto a las rutas que empiezan con /admin
    if request.url.path.startswith("/admin"):
        response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate, max-age=0"
        response.headers["Pragma"] = "no-cache"
        response.headers["Expires"] = "0"
    return response

# Aseguramos que las tablas estén creadas
Base.metadata.create_all(bind=engine)

# Dependencia: Abre y cierra la conexión a la base de datos por cada petición


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

# --- CONFIGURACIÓN DEL PANEL DE ADMINISTRADOR ---


class AdminAuth(AuthenticationBackend):
    async def login(self, request: Request) -> bool:
        form = await request.form()
        username = form.get("username")
        password = form.get("password")

        # Leemos las credenciales desde el archivo .env
        env_username = os.getenv("ADMIN_USERNAME")
        env_password = os.getenv("ADMIN_PASSWORD")

        # Comparamos lo que ingresa el usuario con lo que está en el .env
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


# Leemos la clave secreta del .env
secreto = os.getenv("ADMIN_SECRET_KEY", "clave_de_respaldo_por_si_falla")

# Instanciamos la clase ÚNICAMENTE con la clave secreta leída del .env
authentication_backend = AdminAuth(secret_key=secreto)

admin = Admin(
    app,
    engine,
    title="Schmidt Styles Admin",
    authentication_backend=authentication_backend
)

# Categorías


class CategoriaAdmin(ModelView, model=models.Categoria):
    column_list = [models.Categoria.id, models.Categoria.nombre]
    icon = "fa-solid fa-tags"

    form_excluded_columns = [models.Categoria.productos]

# Productos


class ProductoAdmin(ModelView, model=models.Producto):
    column_list = [models.Producto.id, models.Producto.nombre,
                   models.Producto.precio, models.Producto.categoria, models.Producto.activo]
    icon = "fa-solid fa-shirt"

    form_excluded_columns = [models.Producto.variantes,
                             models.Producto.imagenes, models.Producto.creado_en]

# Talles


class TalleAdmin(ModelView, model=models.Talle):
    column_list = [models.Talle.id, models.Talle.nombre]
    icon = "fa-solid fa-ruler"

    form_excluded_columns = [models.Talle.variantes]

# Colores


class ColorAdmin(ModelView, model=models.Color):
    column_list = [models.Color.id, models.Color.nombre]
    icon = "fa-solid fa-palette"

    form_excluded_columns = [models.Color.variantes]

# Variantes de Producto (Talle + Color + Stock)


class VarianteProductoAdmin(ModelView, model=models.VarianteProducto):
    column_list = [models.VarianteProducto.id, models.VarianteProducto.producto,
                   models.VarianteProducto.talle, models.VarianteProducto.color, models.VarianteProducto.stock]
    icon = "fa-solid fa-boxes-stacked"

# Imágenes de Producto


class ImagenProductoAdmin(ModelView, model=models.ImagenProducto):
    column_list = [models.ImagenProducto.id,
                   models.ImagenProducto.producto, models.ImagenProducto.imagen]
    icon = "fa-solid fa-image"


# Registramos las vistas en el panel de administración
admin.add_view(CategoriaAdmin)
admin.add_view(ImagenProductoAdmin)
admin.add_view(ProductoAdmin)
admin.add_view(TalleAdmin)
admin.add_view(ColorAdmin)
admin.add_view(VarianteProductoAdmin)
