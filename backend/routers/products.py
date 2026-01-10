from fastapi import APIRouter, HTTPException, Query, Depends, File, UploadFile, Request
import shutil
import os
import uuid
from typing import Optional, List
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
import models.scanner as scanner_model
from database import get_db
from decimal import Decimal
from pydantic import BaseModel
from datetime import datetime

# IMPORTANTE: Importa a verificação de usuário do auth.py
from routers.auth import get_current_user
import models.user as user_model

router = APIRouter(prefix="/api", tags=["products"])

# --- Schemas Pydantic para Validação ---
class ScannerBase(BaseModel):
    model: str
    brand: str
    item_condition: str
    original_price: Optional[float] = None
    sale_price: Optional[float] = None
    image_url: Optional[str] = None
    purchase_link: Optional[str] = None
    in_stock: bool = True

class ScannerCreate(ScannerBase):
    pass

class ScannerUpdate(ScannerBase):
    pass

class ScannerResponse(ScannerBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# --- Rotas Públicas (Qualquer um pode ver) ---

@router.get("/scanners/filters/price-ranges")
def get_price_ranges(db: Session = Depends(get_db)):
    """Retorna o preço mínimo e máximo dos produtos para os filtros"""
    try:
        result = db.query(
            scanner_model.Scanner.sale_price
        ).all()

        prices = [float(r[0]) for r in result if r[0] is not None]

        if not prices:
            return {"min": 0, "max": 100000}

        return {
            "min": min(prices),
            "max": max(prices)
        }
    except Exception as e:
        print(f"Erro ao buscar ranges: {str(e)}")
        return {"min": 0, "max": 100000}

@router.get("/scanners")
def get_scanners(
    brand: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    search: Optional[str] = None,
    page: int = 1,
    limit: int = 12,
    db: Session = Depends(get_db)
):
    query = db.query(scanner_model.Scanner)

    # Filtros
    if brand and brand.lower() != "all":
        query = query.filter(scanner_model.Scanner.brand == brand)

    if min_price is not None:
        query = query.filter(scanner_model.Scanner.sale_price >= min_price)

    if max_price is not None:
        query = query.filter(scanner_model.Scanner.sale_price <= max_price)

    if search:
        search_term = f"%{search}%"
        query = query.filter(
            or_(
                scanner_model.Scanner.model.ilike(search_term),
                scanner_model.Scanner.brand.ilike(search_term)
            )
        )

    # Paginação
    total = query.count()
    scanners = query.offset((page - 1) * limit).limit(limit).all()

    return {
        "scanners": scanners,
        "total": total,
        "page": page,
        "pages": (total + limit - 1) // limit
    }

# --- Rotas Protegidas (Apenas Admin Logado) ---
# Adicionamos: current_user: user_model.User = Depends(get_current_user)

@router.post("/scanners", response_model=ScannerResponse)
def create_scanner(
    scanner: ScannerCreate,
    db: Session = Depends(get_db),
    current_user: user_model.User = Depends(get_current_user) # <--- PROTEGIDO
):
    """Criar um novo scanner (Requer Login)"""
    try:
        db_scanner = scanner_model.Scanner(**scanner.dict())
        db.add(db_scanner)
        db.commit()
        db.refresh(db_scanner)
        return db_scanner
    except Exception as e:
        db.rollback()
        print(f"Erro ao criar scanner: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erro ao criar scanner: {str(e)}")

@router.put("/scanners/{scanner_id}")
def update_scanner(
    scanner_id: int,
    scanner_update: ScannerUpdate,
    db: Session = Depends(get_db),
    current_user: user_model.User = Depends(get_current_user) # <--- PROTEGIDO
):
    """Atualizar um scanner existente (Requer Login)"""
    try:
        db_scanner = db.query(scanner_model.Scanner).filter(scanner_model.Scanner.id == scanner_id).first()
        if not db_scanner:
            raise HTTPException(status_code=404, detail="Scanner não encontrado")

        # Atualizar campos
        for key, value in scanner_update.dict().items():
            setattr(db_scanner, key, value)

        db.commit()
        db.refresh(db_scanner)
        return db_scanner
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        print(f"Erro ao atualizar scanner: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erro ao atualizar scanner: {str(e)}")

@router.delete("/scanners/{scanner_id}")
def delete_scanner(
    scanner_id: int,
    db: Session = Depends(get_db),
    current_user: user_model.User = Depends(get_current_user) # <--- PROTEGIDO
):
    """Deletar um scanner (Requer Login)"""
    try:
        db_scanner = db.query(scanner_model.Scanner).filter(scanner_model.Scanner.id == scanner_id).first()
        if not db_scanner:
            raise HTTPException(status_code=404, detail="Scanner não encontrado")

        db.delete(db_scanner)
        db.commit()
        return {"message": "Scanner deletado com sucesso"}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        print(f"Erro ao deletar scanner: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erro ao deletar scanner: {str(e)}")

@router.post("/upload")
async def upload_image(
    request: Request,
    file: UploadFile = File(...),
    current_user: user_model.User = Depends(get_current_user) # <--- PROTEGIDO
):
    """Faz upload de uma imagem (Requer Login)"""
    try:
        UPLOAD_DIR = "uploads"
        if not os.path.exists(UPLOAD_DIR):
            os.makedirs(UPLOAD_DIR)

        file_extension = os.path.splitext(file.filename)[1]
        new_filename = f"{uuid.uuid4()}{file_extension}"
        file_path = os.path.join(UPLOAD_DIR, new_filename)

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Pega a URL base automaticamente
        base_url = str(request.base_url).rstrip("/")
        return {"url": f"{base_url}/uploads/{new_filename}"}
    except Exception as e:
        print(f"Erro no upload: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erro ao fazer upload: {str(e)}")
