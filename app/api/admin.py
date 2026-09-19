from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
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
        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )


@router.get(
    "/reports",
    response_model=List[WasteReportResponse]
)
def get_all_reports(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    check_admin(current_user)

    if not current_user.municipality_area_name:
        raise HTTPException(
            status_code=400,
            detail="Admin municipality area is not assigned"
        )

    reports = (
        db.query(WasteReport)
        .join(
            User,
            WasteReport.user_id == User.user_id
        )
        .filter(
            func.lower(User.municipality_area_name)
            == func.lower(current_user.municipality_area_name)
        )
        .all()
    )

    return reports


@router.get("/workers")
def get_workers(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    check_admin(current_user)

    workers = (
        db.query(User)
        .filter(
            User.role == "WORKER",
            func.lower(User.municipality_area_name)
            == func.lower(current_user.municipality_area_name)
        )
        .all()
    )

    return [
        {
            "user_id": worker.user_id,
            "full_name": worker.full_name,
            "municipality_area_name": worker.municipality_area_name
        }
        for worker in workers
    ]


@router.put(
    "/assign",
    response_model=WasteReportResponse
)
def assign_worker_to_report(
    data: AssignWorker,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    check_admin(current_user)

    report = (
        db.query(WasteReport)
        .join(
            User,
            WasteReport.user_id == User.user_id
        )
        .filter(
            WasteReport.report_id == data.report_id,
            func.lower(User.municipality_area_name)
            == func.lower(current_user.municipality_area_name)
        )
        .first()
    )

    if not report:
        raise HTTPException(
            status_code=404,
            detail="Report not found in your municipality area"
        )

    worker = (
        db.query(User)
        .filter(
            User.user_id == data.worker_id,
            User.role == "WORKER",
            func.lower(User.municipality_area_name)
            == func.lower(current_user.municipality_area_name)
        )
        .first()
    )

    if not worker:
        raise HTTPException(
            status_code=404,
            detail="Worker not found in your municipality area"
        )

    report.worker_id = worker.user_id
    report.status = "ASSIGNED"

    db.commit()
    db.refresh(report)

    return report