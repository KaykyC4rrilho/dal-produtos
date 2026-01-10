from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles # <--- IMPORTANTE
from fastapi.middleware.cors import CORSMiddleware
import os
from routers import products, auth # Seus routers

app = FastAPI()

# 1. Configuração do CORS (Essencial para o React falar com o Python)
origins = [
    "http://localhost:3000", # Se seu React roda na 3000
    "http://localhost:5173", # Se seu React roda na 5173 (Vite)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. CRIA A PASTA SE NÃO EXISTIR
if not os.path.exists("uploads"):
    os.makedirs("uploads")

# 3. A MÁGICA: LIBERAR O ACESSO ÀS IMAGENS
# Isso diz: "Toda vez que alguém acessar http://localhost:8000/uploads/...,
# pegue o arquivo real dentro da pasta 'uploads' do computador."
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Seus Routers
app.include_router(products.router)
app.include_router(auth.router)

@app.get("/")
def read_root():
    return {"message": "API Online"}
