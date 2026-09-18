from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class WasteReportCreate(BaseModel):
    waste_type: str
    location: str
    description: str

class AssignWorker(BaseModel):
    report_id: int
    worker_id: int

class WasteReportResponse(BaseModel):
    report_id: int
    user_id: int
    worker_id: Optional[int] = None
    waste_type: str
    location: str
    description: str
    ai_category: Optional[str] = None
    priority_level: Optional[str] = None
    status: str
    created_at: datetime

    class Config:
        from_attributes = True