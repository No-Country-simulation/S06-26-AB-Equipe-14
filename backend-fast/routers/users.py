from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.auth_service import registar_utilizador, encriptar_password, utilizadores

router = APIRouter(prefix="/api/users")


class UserRequest(BaseModel):
    email: str
    name: str
    password: str
    role: str = "GESTOR"
    organisation: str = ""
    country: str = ""


@router.post("")
def criar_utilizador(dados: UserRequest):
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
        "active": True,
        "createdAt": utilizador["createdAt"]
    }


@router.get("")
def listar_utilizadores():
    return [
        {k: v for k, v in u.items() if k != "password"}
        for u in utilizadores
    ]


@router.get("/{id}")
def ver_utilizador(id: int):
    for u in utilizadores:
        if u["id"] == id:
            return {k: v for k, v in u.items() if k != "password"}
    raise HTTPException(status_code=404, detail="Utilizador não encontrado")


@router.put("/{id}")
def actualizar_utilizador(id: int, dados: UserRequest):
    for u in utilizadores:
        if u["id"] == id:
            u["name"] = dados.name
            u["email"] = dados.email
            u["role"] = dados.role
            u["organisation"] = dados.organisation
            u["country"] = dados.country
            if dados.password:
                u["password"] = encriptar_password(dados.password)
            return {k: v for k, v in u.items() if k != "password"}
    raise HTTPException(status_code=404, detail="Utilizador não encontrado")


@router.patch("/{id}/deactivate")
def desactivar_utilizador(id: int):
    for u in utilizadores:
        if u["id"] == id:
            u["active"] = False
            return {"mensagem": "Utilizador desactivado"}
    raise HTTPException(status_code=404, detail="Utilizador não encontrado")


@router.delete("/{id}")
def apagar_utilizador(id: int):
    for i, u in enumerate(utilizadores):
        if u["id"] == id:
            utilizadores.pop(i)
            return {"mensagem": "Utilizador apagado"}
    raise HTTPException(status_code=404, detail="Utilizador não encontrado")