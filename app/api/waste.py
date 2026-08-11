from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.waste import WasteReportCreate, WasteReportResponse
from app.services.waste_service import create_waste_report, get_waste_reports
router = APIRouter(
    prefix="/waste",
    tags=["Waste Management"]
)
@router.post("/report", response_model=WasteReportResponse)
def report_waste(
    report: WasteReportCreate,
    db: Session = Depends(get_db)
):
    return create_waste_report(db, report)
@router.get("/reports", response_model=list[WasteReportResponse])
def view_waste_reports(
    db: Session = Depends(get_db)
):
    return get_waste_reports(db)        