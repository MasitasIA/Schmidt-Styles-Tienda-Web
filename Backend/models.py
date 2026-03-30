from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, Numeric
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

# Aquí se guardan las Categorías


class Categoria(Base):
    __tablename__ = "categorias"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), unique=True, index=True)

    productos = relationship("Producto", back_populates="categoria")

    def __str__(self):
        return self.nombre

# Aquí se guarda el Producto


class Producto(Base):
    __tablename__ = "productos"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(200))
    descripcion = Column(Text)
    precio = Column(Numeric(10, 2))
    imagen = Column(String)

    categoria_id = Column(Integer, ForeignKey("categorias.id"))
    categoria = relationship("Categoria", back_populates="productos")

    activo = Column(Boolean, default=True)
    creado_en = Column(DateTime, default=datetime.utcnow)

    variantes = relationship("VarianteProducto", back_populates="producto")
    imagenes = relationship("ImagenProducto", back_populates="producto")

    def __str__(self):
        return self.nombre

# Aquí se guardan los Talles


class Talle(Base):
    __tablename__ = "talles"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(10))

    variantes = relationship("VarianteProducto", back_populates="talle")

    def __str__(self):
        return self.nombre

# Aquí se guardan los Colores de las prendas


class Color(Base):
    __tablename__ = "colores"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(50))

    variantes = relationship("VarianteProducto", back_populates="color")

    def __str__(self):
        return self.nombre

# Aquí se guardan los productos a mostrar, incluye talle y color


class VarianteProducto(Base):
    __tablename__ = "variantes_producto"

    id = Column(Integer, primary_key=True, index=True)

    producto_id = Column(Integer, ForeignKey("productos.id"))
    talle_id = Column(Integer, ForeignKey("talles.id"))
    color_id = Column(Integer, ForeignKey("colores.id"))

    stock = Column(Integer, default=0)

    producto = relationship("Producto", back_populates="variantes")
    talle = relationship("Talle", back_populates="variantes")
    color = relationship("Color", back_populates="variantes")

    def __str__(self):
        producto_nom = self.producto.nombre if self.producto else "Producto"
        talle_nom = self.talle.nombre if self.talle else "Talle"
        color_nom = self.color.nombre if self.color else "Color"
        return f"{producto_nom} - {talle_nom} - {color_nom}"

# Clase que se encarga de almacenar las imágenes de los productos


class ImagenProducto(Base):
    __tablename__ = "imagenes_producto"

    id = Column(Integer, primary_key=True, index=True)

    producto_id = Column(Integer, ForeignKey("productos.id"))

    imagen = Column(String)

    producto = relationship("Producto", back_populates="imagenes")

    def __str__(self):
        producto_nom = self.producto.nombre if self.producto else "Desconocido"
        return f"Imagen {self.id} ({producto_nom})"

# Clase que se encarga de almacenar la información de los usuarios


class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100))
    email = Column(String(150), unique=True, index=True)
    password_hash = Column(String(200))
    creado_en = Column(DateTime, default=datetime.utcnow)

    def __str__(self):
        return self.email

# Clase que guarda los favoritos de los usuarios


class Favorito(Base):
    __tablename__ = "favoritos"

    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"))
    producto_id = Column(Integer, ForeignKey("productos.id"))
    fecha_agregado = Column(DateTime, default=datetime.utcnow)

    usuario = relationship("Usuario")
    producto = relationship("Producto")

    def __str__(self):
        return f"Favorito {self.id} (Usuario {self.usuario_id} - Producto {self.producto_id})"
