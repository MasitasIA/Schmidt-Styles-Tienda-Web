import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

# Cargar las variables de entorno
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("La variable de entorno DATABASE_URL no está configurada")

# SQLAlchemy requiere 'postgresql://', pero Supabase a veces da 'postgres://'
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# create_engine es el motor que mantiene la conexión viva
# pool_pre_ping=True es un truco vital para bases de datos en la nube: 
# verifica que la conexión no se haya cortado antes de intentar guardar algo.
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    # Estas dos líneas le enseñan a SQLAlchemy a hablar con PgBouncer
    pool_size=10,
    max_overflow=20,
)
# SessionLocal será nuestra "ventana" de trabajo con la base de datos
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Esta es la clase "Base" que tus modelos están importando
Base = declarative_base()