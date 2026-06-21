import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

DATABASE_URL = os.environ.get(
    "DATABASE_URL",
    "postgresql://bit_user:bit123@localhost:5432/bit_app"
)

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)


def get_db():
    """Dependency que fornece uma sessão do banco de dados por request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()