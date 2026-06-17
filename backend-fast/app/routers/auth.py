from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.auth_service import registar_utilizador, fazer_login, criar_token

router = APIRouter(prefix="/api")

# Formato dos dados que chegam do frontend
class DadosRegisto(BaseModel):
    name: str
    email: str
    password: str
    role: str = "GESTOR"
    organisation: str = ""
    country: str = ""

class DadosLogin(BaseModel):
    email: str
    password: str


@router.post("/auth/register")
def register(dados: DadosRegisto):
    utilizador = registar_utilizador(dados.name, dados.email, dados.password)
    if utilizador is None:
        raise HTTPException(status_code=400, detail="Email já registado")
    return {
        "id": utilizador["id"],
        "name": utilizador["name"],
        "email": utilizador["email"],
        "role": dados.role,
        "organisation": dados.organisation,
        "country": dados.country,
        "active": True
    }


@router.post("/users/login")
def login(dados: DadosLogin):
    utilizador = fazer_login(dados.email, dados.password)
    
    if utilizador is None:
        raise HTTPException(status_code=401, detail="Email ou password incorretos")
    
    token = criar_token(utilizador["email"])
    
    return {
        "token": token,
        "user": {
            "id": utilizador["id"],
            "name": utilizador["name"],
            "email": utilizador["email"],
            "role": utilizador["role"],
            "active": utilizador["active"],
            "createdAt": utilizador["createdAt"]
        }
    }