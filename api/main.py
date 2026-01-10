from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import products, auth

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Seus Routers
app.include_router(products.router)
app.include_router(auth.router)

@app.get("/")
def read_root():
    return {"message": "API Online e pronta para Vercel"}
