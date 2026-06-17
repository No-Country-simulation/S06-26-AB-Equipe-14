from datetime import datetime, timedelta, timezone
from jose import jwt
from passlib.context import CryptContext

# Chave secreta para gerar os tokens (em produção muda isto para uma chave segura)
SECRET_KEY = "chave-secreta-do-appbit-2026"
ALGORITHM = "HS256"

# Ferramenta para encriptar passwords
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Base de dados em memória (lista de utilizadores)
utilizadores = []
proximo_id = 1


def encriptar_password(password: str) -> str:
    return pwd_context.hash(password)


def verificar_password(password: str, password_encriptada: str) -> bool:
    return pwd_context.verify(password, password_encriptada)


def criar_token(email: str) -> str:
    expiracao = datetime.now(timezone.utc) + timedelta(hours=24)
    dados = {"sub": email, "exp": expiracao}
    return jwt.encode(dados, SECRET_KEY, algorithm=ALGORITHM)


def registar_utilizador(name: str, email: str, password: str) -> dict:
    global proximo_id

    # Verifica se o email já existe
    for u in utilizadores:
        if u["email"] == email:
            return None  # já existe

    utilizador = {
        "id": proximo_id,
        "name": name,
        "email": email,
        "password": encriptar_password(password),
        "role": "GESTOR",
        "active": True,
        "createdAt": datetime.now(timezone.utc).isoformat()
    }
    utilizadores.append(utilizador)
    proximo_id += 1
    return utilizador


def fazer_login(email: str, password: str) -> dict:
    for u in utilizadores:
        if u["email"] == email:
            if verificar_password(password, u["password"]):
                return u
    return None