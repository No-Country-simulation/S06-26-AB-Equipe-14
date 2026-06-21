from datetime import datetime, timedelta, timezone
from jose import jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from app.repositories.user_repository import get_user_by_email, create_user

# Chave secreta para gerar os tokens (em produção muda isto para uma chave segura)
SECRET_KEY = "chave-secreta-do-appbit-2026"
ALGORITHM = "HS256"

# Ferramenta para encriptar passwords
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def encriptar_password(password: str) -> str:
    return pwd_context.hash(password)


def verificar_password(password: str, password_encriptada: str) -> bool:
    return pwd_context.verify(password, password_encriptada)


def criar_token(email: str) -> str:
    expiracao = datetime.now(timezone.utc) + timedelta(hours=24)
    dados = {"sub": email, "exp": expiracao}
    return jwt.encode(dados, SECRET_KEY, algorithm=ALGORITHM)


def registar_utilizador(
    db: Session, name: str, email: str, password: str,
    role: str = "GESTOR", organisation: str = "", country: str = ""
) -> dict | None:
    # Verifica se o email já existe
    existente = get_user_by_email(db, email)
    if existente:
        return None  # já existe

    hashed = encriptar_password(password)
    user = create_user(
        db=db,
        name=name,
        email=email,
        hashed_password=hashed,
        role=role,
        organisation=organisation,
        country=country,
    )
    return user


def fazer_login(db: Session, email: str, password: str):
    user = get_user_by_email(db, email)
    if user and verificar_password(password, user.password):
        return user
    return None