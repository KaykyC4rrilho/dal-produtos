from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles # <--- 1. IMPORTAR ISSO
import os

# Seus imports de rotas
from routers import products

app = FastAPI()

# ... (sua configuração de CORS existente) ...
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Ou a URL do seu front
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- CORREÇÃO DO ERRO 404 ---

# 2. Garantir que a pasta existe para não dar erro ao iniciar
if not os.path.exists("uploads"):
    os.makedirs("uploads")

# 3. "Montar" a pasta para torná-la acessível publicamente
# Isso diz: "Quando alguém acessar /uploads, mostre os arquivos da pasta 'uploads'"
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# ----------------------------

app.include_router(products.router)

@app.get("/")
def read_root():
    return {"message": "API Scanners Online"}
