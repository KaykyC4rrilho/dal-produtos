# backend/create_admin.py
from database import SessionLocal
from models.user import User
from passlib.context import CryptContext

# Configuração de hash igual ao do sistema
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_admin():
    db = SessionLocal()

    email = "carvarlhosa@dal.com.br"
    password = "FcFcLc07" # Mude para a senha que desejar

    # Verifica se já existe
    existing_user = db.query(User).filter(User.email == email).first()
    if existing_user:
        print(f"Usuário {email} já existe!")
        return

    hashed_password = pwd_context.hash(password)

    new_user = User(email=email, hashed_password=hashed_password)
    db.add(new_user)
    db.commit()
    print(f"Usuário {email} criado com sucesso!")
    db.close()

if __name__ == "__main__":
    create_admin()
