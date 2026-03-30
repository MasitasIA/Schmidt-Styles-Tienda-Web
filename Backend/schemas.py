from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

# --- ESQUEMAS PARA USUARIOS ---


class UsuarioCreate(BaseModel):
    nombre: str
    email: EmailStr
    password: str


class UsuarioResponse(BaseModel):
    id: int
    nombre: str
    email: EmailStr

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str


# --- ESQUEMAS PARA TALLES ---


class TalleBase(BaseModel):
    nombre: str


class TalleCreate(TalleBase):
    pass


class TalleResponse(TalleBase):
    id: int

    class Config:
        from_attributes = True

# --- ESQUEMAS PARA COLORES ---


class ColorBase(BaseModel):
    nombre: str


class ColorCreate(ColorBase):
    pass


class ColorResponse(ColorBase):
    id: int

    class Config:
        from_attributes = True

# --- ESQUEMAS PARA PRODUCTOS ---


class ProductoBase(BaseModel):
    nombre: str
    descripcion: str
    precio: float
    imagen: Optional[str] = None
    categoria: str
    activo: bool = True


class ProductoCreate(ProductoBase):
    pass

# --- ESQUEMA DE CATEGORÍA ---


class CategoriaResponse(BaseModel):
    id: int
    nombre: str

    class Config:
        from_attributes = True

# --- ESQUEMAS PARA IMAGENES ---


class ImagenProductoResponse(BaseModel):
    id: int
    imagen: str

    class Config:
        from_attributes = True


class ProductoResponse(BaseModel):
    id: int
    nombre: str
    descripcion: str
    precio: float
    activo: bool

    categorias: Optional[CategoriaResponse] = None

    imagenes: list[ImagenProductoResponse] = []

    class Config:
        from_attributes = True

# --- ESQUEMAS PARA FAVORITOS ---


class FavoritoBase(BaseModel):
    producto_id: int


class FavoritoCreate(FavoritoBase):
    pass


class FavoritoResponse(BaseModel):
    id: int
    usuario_id: int
    producto_id: int
    fecha_agregado: datetime

    producto: Optional[ProductoResponse] = None

    class Config:
        from_attributes = True
