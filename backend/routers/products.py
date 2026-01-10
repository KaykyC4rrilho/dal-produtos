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

# --- Endpoints Existentes ---

@router.get("/teste-banco")
def teste_conexao(db: Session = Depends(get_db)):
    """Endpoint para testar conexão com o banco"""
    try:
        # Tenta executar uma query simples
        result = db.execute("SELECT 1")
        return {"message": "Conexão com o banco estabelecida com sucesso!"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao conectar ao banco de dados: {str(e)}")

@router.get("/scanners")
@router.get("/scanners")
def get_scanners(
    brand: Optional[str] = Query(None),
    min_price: Optional[float] = Query(None),
    max_price: Optional[float] = Query(None),
    search: Optional[str] = Query(None),
    in_stock: Optional[bool] = Query(None), # Se None, traz todos (estoque e sem estoque)
    page: int = Query(1, ge=1),
    limit: int = Query(12, ge=1, le=100),
    db: Session = Depends(get_db)
):
    try:
        query = db.query(scanner_model.Scanner)

        # Filtros
        if brand and brand != "all":
            query = query.filter(scanner_model.Scanner.brand == brand)

        if min_price is not None:
            query = query.filter(scanner_model.Scanner.sale_price >= min_price)

        if max_price is not None:
            query = query.filter(scanner_model.Scanner.sale_price <= max_price)

        # IMPORTANTE: Se in_stock for None, não filtra (traz tudo).
        # Se for True, traz só em estoque. Se False, só sem estoque.
        if in_stock is not None:
            query = query.filter(scanner_model.Scanner.in_stock == in_stock)

        if search:
            search_term = f"%{search}%"
            query = query.filter(
                or_(
                    scanner_model.Scanner.model.ilike(search_term),
                    scanner_model.Scanner.brand.ilike(search_term)
                )
            )

        total = query.count()
        offset = (page - 1) * limit
        scanners = query.order_by(scanner_model.Scanner.created_date.desc()).offset(offset).limit(limit).all()

        return {
            "scanners": [
                {
                    "id": s.id,
                    "model": s.model,
                    "brand": s.brand,
                    "condition": s.item_condition,
                    "original_price": float(s.original_price) if s.original_price else 0.0,
                    "sale_price": float(s.sale_price) if s.sale_price else 0.0,
                    "image_url": s.image_url,
                    "purchase_link": s.purchase_link,
                    "in_stock": s.in_stock,
                    "created_date": s.created_date
                } for s in scanners
            ],
            "total": total,
            "page": page,
            "limit": limit,
            "total_pages": (total + limit - 1) // limit
        }

    except Exception as e:
        print(f"Erro ao buscar scanners: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erro interno: {str(e)}")

@router.get("/scanners/{scanner_id}")
def get_scanner_by_id(scanner_id: int, db: Session = Depends(get_db)):
    try:
        scanner = db.query(scanner_model.Scanner).filter(scanner_model.Scanner.id == scanner_id).first()
        if not scanner:
            raise HTTPException(status_code=404, detail="Scanner não encontrado")
        return scanner
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/scanners/{scanner_id}")
def get_scanner_by_id(scanner_id: int, db: Session = Depends(get_db)):
    """Buscar scanner por ID"""
    try:
        scanner = db.query(scanner_model.Scanner).filter(scanner_model.Scanner.id == scanner_id).first()

        if not scanner:
            raise HTTPException(status_code=404, detail="Scanner não encontrado")

        return {
            "id": scanner.id,
            "model": scanner.model,
            "brand": scanner.brand,
            "condition": scanner.item_condition,
            "original_price": float(scanner.original_price) if scanner.original_price else 0.0,
            "sale_price": float(scanner.sale_price) if scanner.sale_price else 0.0,
            "image_url": scanner.image_url,
            "purchase_link": scanner.purchase_link,
            "in_stock": scanner.in_stock if scanner.in_stock is not None else True,
            "created_date": scanner.created_date.isoformat() if scanner.created_date else None
        }

    except HTTPException:
        raise
    except Exception as e:
        print(f"Erro ao buscar scanner: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erro ao buscar scanner: {str(e)}")

@router.get("/scanners/brands/all")
def get_all_brands(db: Session = Depends(get_db)):
    """Buscar todas as marcas disponíveis"""
    try:
        brands = db.query(scanner_model.Scanner.brand) \
            .filter(scanner_model.Scanner.in_stock == True) \
            .distinct() \
            .order_by(scanner_model.Scanner.brand) \
            .all()

        # Extrair os valores das tuplas
        brand_list = [brand[0] for brand in brands if brand[0]]

        return {"brands": brand_list}

    except Exception as e:
        print(f"Erro ao buscar marcas: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erro ao buscar marcas: {str(e)}")

@router.get("/scanners/filters/price-ranges")
def get_price_ranges(db: Session = Depends(get_db)):
    """Obter estatísticas de preço para filtros"""
    try:
        # Obter preço mínimo e máximo
        min_price_result = db.query(scanner_model.Scanner.sale_price) \
            .filter(scanner_model.Scanner.in_stock == True) \
            .order_by(scanner_model.Scanner.sale_price.asc()) \
            .first()

        max_price_result = db.query(scanner_model.Scanner.sale_price) \
            .filter(scanner_model.Scanner.in_stock == True) \
            .order_by(scanner_model.Scanner.sale_price.desc()) \
            .first()

        min_price = float(min_price_result[0]) if min_price_result and min_price_result[0] else 0
        max_price = float(max_price_result[0]) if max_price_result and max_price_result[0] else 0

        return {
            "min_price": min_price,
            "max_price": max_price
        }

    except Exception as e:
        print(f"Erro ao buscar faixas de preço: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erro ao buscar faixas de preço: {str(e)}")

# --- NOVOS ENDPOINTS DE CRUD ---

@router.post("/scanners", status_code=201)
def create_scanner(scanner: ScannerCreate, db: Session = Depends(get_db)):
    """Criar um novo scanner"""
    try:
        db_scanner = scanner_model.Scanner(
            model=scanner.model,
            brand=scanner.brand,
            item_condition=scanner.item_condition,
            original_price=scanner.original_price,
            sale_price=scanner.sale_price,
            image_url=scanner.image_url,
            purchase_link=scanner.purchase_link,
            in_stock=scanner.in_stock,
            created_date=datetime.now()
        )
        db.add(db_scanner)
        db.commit()
        db.refresh(db_scanner)
        return db_scanner
    except Exception as e:
        db.rollback()
        print(f"Erro ao criar scanner: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erro ao criar scanner: {str(e)}")

@router.put("/scanners/{scanner_id}")
def update_scanner(scanner_id: int, scanner_update: ScannerUpdate, db: Session = Depends(get_db)):
    """Atualizar um scanner existente"""
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
def delete_scanner(scanner_id: int, db: Session = Depends(get_db)):
    """Deletar um scanner"""
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
async def upload_image(request: Request, file: UploadFile = File(...)): # <--- Adicione request: Request
    """Faz upload de uma imagem e retorna a URL dinâmica"""
    try:
        UPLOAD_DIR = "uploads"
        if not os.path.exists(UPLOAD_DIR):
            os.makedirs(UPLOAD_DIR)

        file_extension = os.path.splitext(file.filename)[1]
        new_filename = f"{uuid.uuid4()}{file_extension}"
        file_path = os.path.join(UPLOAD_DIR, new_filename)

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Pega a URL base automaticamente (ex: http://localhost:8000 ou https://api.seusite.com)
        base_url = str(request.base_url).rstrip("/")

        return {"url": f"{base_url}/uploads/{new_filename}"}

    except Exception as e:
        print(f"Erro no upload: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erro ao fazer upload: {str(e)}")