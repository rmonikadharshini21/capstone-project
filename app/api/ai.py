from fastapi import APIRouter
from pydantic import BaseModel
from app.services.ai_service import classify_waste_and_priority

router = APIRouter(
    prefix="/ai",
    tags=["AI Operations"]
)

class WasteAnalyzeRequest(BaseModel):
    description: str

@router.post("/analyze")
def analyze_waste(data: WasteAnalyzeRequest):
    return classify_waste_and_priority(data.description)