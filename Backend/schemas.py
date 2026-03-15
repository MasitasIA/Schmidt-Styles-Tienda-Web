from pydantic import BaseModel
from typing import Optional
from datetime import datetime

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

# ... (todo el código anterior)

# Esquema nuevo para mostrar las imágenes
class ImagenProductoResponse(BaseModel):
    id: int
    imagen: str # Aquí vendrá la URL
    class Config:
        from_attributes = True

# Modificamos el ProductoResponse para incluir la lista de imágenes
class ProductoResponse(ProductoBase):
    id: int
    creado_en: datetime
    # ¡Esta línea es la clave! Agregamos la lista de imágenes
    imagenes: list[ImagenProductoResponse] = []

    class Config:
        from_attributes = True
