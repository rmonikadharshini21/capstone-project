from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.models.waste import WasteReport
from app.schemas.waste import WasteReportResponse, AssignWorker
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter(
    prefix="/admin",
    tags=["Admin Operations"]
)

def check_admin(user: User):
    if user.role != "ADMIN":
        raise HTTPException(status_code=403, detail="Admin access required")

@router.get("/reports", response_model=List[WasteReportResponse])
def get_all_reports(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    check_admin(current_user)
    return db.query(WasteReport).all()

@router.put("/assign", response_model=WasteReportResponse)
def assign_worker_to_report(
    data: AssignWorker,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    check_admin(current_user)
    
    report = db.query(WasteReport).filter(WasteReport.report_id == data.report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
        
    report.worker_id = data.worker_id
    report.status = "ASSIGNED"
    
    db.commit()
    db.refresh(report)
    return report