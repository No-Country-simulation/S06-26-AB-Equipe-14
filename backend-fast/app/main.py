from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers.auth import router as auth_router
from app.routers.users import router as users_router
from app.database import engine
from app.models.base import Base
from app.models.antena import Antena
from app.models.user import User

from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        Base.metadata.create_all(bind=engine)
        print("Tabelas criadas/verificadas com sucesso no banco de dados remoto.")
    except Exception as e:
        print(f"Alerta: Não foi possível conectar ao banco de dados no startup: {e}")
        print("O servidor continuará rodando, mas requisições ao banco podem falhar.")
    yield

app = FastAPI(title="App BiT API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", 
                   "http://localhost:3001", 
                   "http://localhost:3003", 
                   "http://frontend:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(users_router)

@app.get("/")
def inicio():
    return {"mensagem": "Backend App BiT a funcionar!"}