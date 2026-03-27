import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

# Cargar las variables de entorno
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

# Error si la Base de Datos no carga
if not DATABASE_URL:
    raise ValueError("La variable de entorno DATABASE_URL no está configurada")

# Cargando la Base de Datos
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20,
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
