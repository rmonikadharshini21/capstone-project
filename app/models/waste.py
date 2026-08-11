from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from app.core.database import Base
class WasteReport(Base):
    __tablename__ = "waste_reports"
    report_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    waste_type = Column(String(50), nullable=False)
    location = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    status = Column(String(20), nullable=False, default="PENDING")
    created_at = Column(DateTime, default=datetime.utcnow)