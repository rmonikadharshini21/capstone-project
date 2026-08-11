from datetime import datetime
from pydantic import BaseModel
class WasteReportCreate(BaseModel):
    user_id: int
    waste_type: str
    location: str
    description: str
class WasteReportResponse(BaseModel):
    report_id: int
    user_id: int
    waste_type: str
    location: str
    description: str
    status: str
    created_at: datetime
    class Config:
        from_attributes = True