

import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from app.database import engine, DATABASE_URL
from app.models.base import Base


from app.models.antena import Antena  



def run_migration():
    
    safe_url = DATABASE_URL
    if "@" in safe_url:
        prefix, suffix = safe_url.split("@", 1)
        safe_url = prefix.rsplit(":", 1)[0] + ":***@" + suffix

    print(f" Conectando a: {safe_url}")
    print(f" Tabelas a criar: {list(Base.metadata.tables.keys())}")

    Base.metadata.create_all(bind=engine)

    print(" Migração concluída com sucesso! Tabelas criadas/verificadas.")


if __name__ == "__main__":
    run_migration()
