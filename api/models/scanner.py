from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, DECIMAL
from sqlalchemy.sql import func
from database import Base

class Scanner(Base):
    __tablename__ = "scanners"

    id = Column(Integer, primary_key=True, index=True)
    model = Column(String(255), nullable=False)
    brand = Column(String(50), nullable=False)
    item_condition = Column(String(50), nullable=False)
    original_price = Column(DECIMAL(10, 2), nullable=False)
    sale_price = Column(DECIMAL(10, 2), nullable=False)
    image_url = Column(Text, nullable=True)
    purchase_link = Column(Text)
    in_stock = Column(Boolean, default=True)
    created_date = Column(DateTime(timezone=True), server_default=func.now())