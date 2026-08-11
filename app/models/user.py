from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime
from app.core.database import Base
class User(Base):
    __tablename__ = "users"
    user_id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, nullable=False, index=True)
    password = Column(String(255), nullable=False)
    phone = Column(String(15), nullable=False)
    address = Column(String(255), nullable=False)
    municipality_area_name = Column(String(100), nullable=False)
    municipality_number = Column(String(20), nullable=False)
    role = Column(String(20), nullable=False, default="PUBLIC")
    created_at = Column(DateTime, default=datetime.utcnow)