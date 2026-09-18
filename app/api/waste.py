from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.waste import WasteReportCreate, WasteReportResponse
from app.services.waste_service import create_waste_report, get_waste_reports
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter(
    prefix="/waste",
    tags=["Waste Management"]
)

@router.post("/report", response_model=WasteReportResponse)
def report_waste(
    report: WasteReportCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Pass the user_id securely from the token, not from the user's input
    return create_waste_report(db, report, current_user.user_id)

@router.get("/reports", response_model=list[WasteReportResponse])
def view_waste_reports(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Pass user_id so users only see their own reports
    return get_waste_reports(db, current_user.user_id)