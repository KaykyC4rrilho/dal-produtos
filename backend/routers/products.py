from fastapi import APIRouter, HTTPException, Query, Depends
from typing import Optional, List, Dict, Any
import mysql.connector
from mysql.connector import Error
import os
from dotenv import load_dotenv

# Carregar variáveis de ambiente
load_dotenv()

router = APIRouter(prefix="/api", tags=["products"])


# Configuração do banco de dados
def get_db_connection():
    """Cria conexão com o banco de dados"""
    try:
        connection = mysql.connector.connect(
            host=os.getenv('DB_HOST', 'localhost'),
            user=os.getenv('DB_USER', 'root'),
            password=os.getenv('DB_PASSWORD', ''),
            database=os.getenv('DB_NAME', 'seu_banco_de_dados'),
            port=int(os.getenv('DB_PORT', 3306))
        )
        return connection
    except Error as e:
        print(f"Erro ao conectar ao MySQL: {e}")
        return None


@router.get("/teste-banco")
def teste_conexao():
    """Endpoint para testar conexão com o banco"""
    connection = get_db_connection()
    if connection:
        connection.close()
        return {"message": "Conexão com o banco estabelecida com sucesso!"}
    else:
        raise HTTPException(status_code=500, detail="Erro ao conectar ao banco de dados")


@router.get("/scanners")
def get_scanners(
        brand: Optional[str] = Query(None, description="Filtrar por marca"),
        min_price: Optional[float] = Query(None, description="Preço mínimo"),
        max_price: Optional[float] = Query(None, description="Preço máximo"),
        search: Optional[str] = Query(None, description="Buscar por modelo"),
        in_stock: Optional[bool] = Query(True, description="Somente em estoque"),
        limit: int = Query(100, description="Limite de resultados"),
        offset: int = Query(0, description="Offset para paginação")
):
    """Buscar scanners com filtros"""
    connection = get_db_connection()
    if not connection:
        raise HTTPException(status_code=500, detail="Erro ao conectar ao banco de dados")

    try:
        cursor = connection.cursor(dictionary=True)

        # Construir query base
        query = """
        SELECT 
            id,
            model,
            brand,
            item_condition AS `condition`,
            original_price,
            sale_price,
            image_url,
            purchase_link,
            in_stock,
            created_date
        FROM scanners
        WHERE 1=1
        """

        params = []

        # Adicionar filtros
        if in_stock:
            query += " AND in_stock = 1"

        if brand and brand != "all":
            query += " AND brand = %s"
            params.append(brand)

        if min_price is not None:
            query += " AND sale_price >= %s"
            params.append(min_price)

        if max_price is not None:
            query += " AND sale_price <= %s"
            params.append(max_price)

        if search:
            query += " AND (model LIKE %s OR brand LIKE %s)"
            params.append(f"%{search}%")
            params.append(f"%{search}%")

        # Ordenação e paginação
        query += " ORDER BY created_date DESC"
        query += " LIMIT %s OFFSET %s"
        params.extend([limit, offset])

        # Executar query
        cursor.execute(query, params)
        scanners = cursor.fetchall()

        # Contar total de resultados (sem paginação)
        count_query = """
        SELECT COUNT(*) as total
        FROM scanners
        WHERE 1=1
        """
        count_params = []

        if in_stock:
            count_query += " AND in_stock = 1"

        if brand and brand != "all":
            count_query += " AND brand = %s"
            count_params.append(brand)

        if min_price is not None:
            count_query += " AND sale_price >= %s"
            count_params.append(min_price)

        if max_price is not None:
            count_query += " AND sale_price <= %s"
            count_params.append(max_price)

        if search:
            count_query += " AND (model LIKE %s OR brand LIKE %s)"
            count_params.append(f"%{search}%")
            count_params.append(f"%{search}%")

        cursor.execute(count_query, count_params)
        total = cursor.fetchone()['total']

        cursor.close()
        connection.close()

        return {
            "scanners": scanners,
            "total": total,
            "limit": limit,
            "offset": offset
        }

    except Error as e:
        print(f"Erro ao executar query: {e}")
        raise HTTPException(status_code=500, detail=f"Erro ao buscar dados: {e}")


@router.get("/scanners/{scanner_id}")
def get_scanner_by_id(scanner_id: int):
    """Buscar scanner por ID"""
    connection = get_db_connection()
    if not connection:
        raise HTTPException(status_code=500, detail="Erro ao conectar ao banco de dados")

    try:
        cursor = connection.cursor(dictionary=True)

        query = """
        SELECT 
            id,
            model,
            brand,
            item_condition AS `condition`,
            original_price,
            sale_price,
            image_url,
            purchase_link,
            in_stock,
            created_date,
            description,
            specifications
        FROM scanners
        WHERE id = %s
        """

        cursor.execute(query, (scanner_id,))
        scanner = cursor.fetchone()

        cursor.close()
        connection.close()

        if not scanner:
            raise HTTPException(status_code=404, detail="Scanner não encontrado")

        return scanner

    except Error as e:
        print(f"Erro ao executar query: {e}")
        raise HTTPException(status_code=500, detail=f"Erro ao buscar scanner: {e}")


@router.get("/scanners/brands/all")
def get_all_brands():
    """Buscar todas as marcas disponíveis"""
    connection = get_db_connection()
    if not connection:
        raise HTTPException(status_code=500, detail="Erro ao conectar ao banco de dados")

    try:
        cursor = connection.cursor()

        query = "SELECT DISTINCT brand FROM scanners WHERE in_stock = 1 ORDER BY brand"

        cursor.execute(query)
        brands = [row[0] for row in cursor.fetchall()]

        cursor.close()
        connection.close()

        return {"brands": brands}

    except Error as e:
        print(f"Erro ao executar query: {e}")
        raise HTTPException(status_code=500, detail=f"Erro ao buscar marcas: {e}")