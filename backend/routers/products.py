from fastapi import APIRouter, HTTPException, Query, Depends, File, UploadFile, Request
import base64
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
    image_url: Optional[str] = None # Receberá a string Base64 (Requer coluna TEXT/LONGTEXT no banco)
    purchase_link: Optional[str] = None
    in_stock: bool = True

class ScannerCreate(ScannerBase):
    pass

class ScannerUpdate(ScannerBase):
    pass

class ScannerResponse(ScannerBase):
    id: int
    # created_at: datetime  <-- SE TIVER ISSO, COMENTE OU MUDE PARA:
    created_at: Optional[datetime] = None

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
    skip: int = 0,
    limit: int = 10,
    search: Optional[str] = None,
    brand: Optional[str] = None,
    exclude_id: Optional[int] = None, # <--- NOVO PARÂMETRO
    db: Session = Depends(get_db)
):
    query = db.query(scanner_model.Scanner)

    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            or_(
                scanner_model.Scanner.model.ilike(search_filter),
                scanner_model.Scanner.brand.ilike(search_filter)
            )
        )

    if brand:
        query = query.filter(scanner_model.Scanner.brand == brand)

    # --- NOVO FILTRO ---
    if exclude_id:
        query = query.filter(scanner_model.Scanner.id != exclude_id)
    # -------------------

    total = query.count()
    scanners = query.offset(skip).limit(limit).all()

    return {"total": total, "scanners": scanners}

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

        # ALTERAÇÃO AQUI:
        # Se não encontrar o scanner, assumimos que ele já foi deletado (provavelmente pelo duplo clique)
        # e retornamos sucesso (200) ao invés de erro (404).
        if not db_scanner:
            return {"message": "Scanner deletado (ou não existia)"}

        db.delete(db_scanner)
        db.commit()
        return {"message": "Scanner deletado com sucesso"}

    except Exception as e:
        db.rollback()
        print(f"Erro ao deletar scanner: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erro ao deletar scanner: {str(e)}")

@router.post("/upload")
async def upload_image(
    file: UploadFile = File(...),
    current_user: user_model.User = Depends(get_current_user) # <--- PROTEGIDO
):
    """
    Faz upload de uma imagem convertendo para Base64.
    Retorna a string Base64 pronta para ser salva no banco.
    """
    try:
        # Lê o arquivo em memória
        contents = await file.read()

        # Converte para Base64
        encoded_string = base64.b64encode(contents).decode("utf-8")

        # Cria o Data URI (ex: data:image/jpeg;base64,...)
        base64_url = f"data:{file.content_type};base64,{encoded_string}"

        # Retorna com a chave "url" para manter compatibilidade com o frontend
        return {"url": base64_url}

    except Exception as e:
        print(f"Erro no upload (Base64): {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erro ao processar imagem: {str(e)}")
