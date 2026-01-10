from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from database import engine, Base
from routers import products, auth
import os

# Cria as tabelas no banco (se não existirem)
Base.metadata.create_all(bind=engine)

app = FastAPI()

# --- CONFIGURAÇÃO DO CORS (Onde está o erro) ---
origins = [
    "http://localhost:3000", # Seu frontend React
    "http://localhost:5173", # Vite (caso mude a porta)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True, # Importante para o Login funcionar
    allow_methods=["*"],    # Permite GET, POST, PUT, DELETE, etc.
    allow_headers=["*"],    # Permite enviar o Token no header
)

# --- ARQUIVOS ESTÁTICOS (IMAGENS) ---
# Cria a pasta uploads se não existir
if not os.path.exists("uploads"):
    os.makedirs("uploads")

# Serve a pasta uploads na URL /uploads
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# --- ROTAS ---
app.include_router(auth.router)
app.include_router(products.router)

@app.get("/")
def read_root():
    return {"message": "API do Catálogo de Scanners rodando!"}
