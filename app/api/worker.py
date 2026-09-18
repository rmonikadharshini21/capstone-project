from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.schemas.waste import WasteReportResponse
from app.services.worker_service import get_assigned_tasks, update_task_status
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter(
    prefix="/worker",
    tags=["Worker Operations"]
)

def check_worker(user: User):
    if user.role not in ["WORKER", "ADMIN"]:
        raise HTTPException(status_code=403, detail="Worker access required")

@router.get("/tasks", response_model=List[WasteReportResponse])
def view_tasks(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    check_worker(current_user)
    return get_assigned_tasks(db, current_user.user_id)

@router.put("/tasks/{report_id}/status", response_model=WasteReportResponse)
def change_task_status(
    report_id: int,
    status: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    check_worker(current_user)
    updated = update_task_status(db, report_id, current_user.user_id, status)
    if not updated:
        raise HTTPException(status_code=404, detail="Task not found or not assigned to you")
    return updated