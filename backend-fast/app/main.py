from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers.auth import router as auth_router
from app.routers.users import router as users_router
from app.database import engine
from app.models.base import Base
from app.models.antena import Antena

Base.metadata.create_all(bind=engine)

app = FastAPI(title="App BiT API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://frontend:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(users_router)

@app.get("/")
def inicio():
    return {"mensagem": "Backend App BiT a funcionar!"}