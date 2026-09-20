from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List

from app.core.database import get_db
from app.models.waste import WasteReport, Feedback
from app.schemas.waste import (
    WasteReportResponse,
    AssignWorker,
    FeedbackResponse,
    ExtensionDecision
)
from app.api.deps import get_current_user
from app.models.user import User
from app.services.worker_service import decide_extension


router = APIRouter(
    prefix="/admin",
    tags=["Admin Operations"]
)


# =====================================================
# AREA MATCHING
# =====================================================

def same_area_filter(column, area_name):
    return (
        func.lower(func.trim(column))
        == func.lower(func.trim(area_name))
    )


# =====================================================
# CHECK ADMIN
# =====================================================

def check_admin(user: User):
    if user.role != "ADMIN":
        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )


# =====================================================
# CHECK ADMIN AREA
# =====================================================

def check_admin_area(user: User):
    if not user.municipality_area_name:
        raise HTTPException(
            status_code=400,
            detail="Admin area is not assigned"
        )


# =====================================================
# GET ALL REPORTS
# =====================================================

@router.get(
    "/reports",
    response_model=List[WasteReportResponse]
)
def get_all_reports(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    check_admin(current_user)
    check_admin_area(current_user)

    reports = (
        db.query(WasteReport)
        .join(
            User,
            WasteReport.user_id == User.user_id
        )
        .filter(
            same_area_filter(
                User.municipality_area_name,
                current_user.municipality_area_name
            )
        )
        .all()
    )

    print("ADMIN ID:", current_user.user_id)
    print("ADMIN AREA:", current_user.municipality_area_name)
    print("REPORT COUNT:", len(reports))

    return reports


# =====================================================
# GET WORKERS
# =====================================================

@router.get("/workers")
def get_workers(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    check_admin(current_user)
    check_admin_area(current_user)

    workers = (
        db.query(User)
        .filter(
            User.role == "WORKER",
            same_area_filter(
                User.municipality_area_name,
                current_user.municipality_area_name
            )
        )
        .all()
    )

    return [
        {
            "user_id": worker.user_id,
            "full_name": worker.full_name,
            "municipality_area_name": worker.municipality_area_name,
            "municipality_number": worker.municipality_number
        }
        for worker in workers
    ]


# =====================================================
# ASSIGN WORKER
# =====================================================

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
    check_admin_area(current_user)

    report = (
        db.query(WasteReport)
        .join(
            User,
            WasteReport.user_id == User.user_id
        )
        .filter(
            WasteReport.report_id == data.report_id,
            same_area_filter(
                User.municipality_area_name,
                current_user.municipality_area_name
            )
        )
        .first()
    )

    if not report:
        raise HTTPException(
            status_code=404,
            detail="Report not found in your area"
        )

    if report.status == "COMPLETED":
        raise HTTPException(
            status_code=400,
            detail="This report is already completed"
        )

    worker = (
        db.query(User)
        .filter(
            User.user_id == data.worker_id,
            User.role == "WORKER",
            same_area_filter(
                User.municipality_area_name,
                current_user.municipality_area_name
            )
        )
        .first()
    )

    if not worker:
        raise HTTPException(
            status_code=404,
            detail="Worker not found in your area"
        )

    report.worker_id = worker.user_id
    report.status = "ASSIGNED"
    report.assignment_status = "WAITING"

    if data.expected_completion_at:
        report.expected_completion_at = data.expected_completion_at

    report.extension_reason = None
    report.proposed_completion_at = None
    report.extension_status = "NONE"

    db.commit()
    db.refresh(report)

    return report


# =====================================================
# ADMIN EXTENSION DECISION
# =====================================================

@router.put(
    "/reports/{report_id}/extension-decision",
    response_model=WasteReportResponse
)
def admin_extension_decision(
    report_id: int,
    data: ExtensionDecision,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    check_admin(current_user)
    check_admin_area(current_user)

    report = (
        db.query(WasteReport)
        .join(
            User,
            WasteReport.user_id == User.user_id
        )
        .filter(
            WasteReport.report_id == report_id,
            same_area_filter(
                User.municipality_area_name,
                current_user.municipality_area_name
            )
        )
        .first()
    )

    if not report:
        raise HTTPException(
            status_code=404,
            detail="Report not found in your area"
        )

    if report.extension_status != "PENDING":
        raise HTTPException(
            status_code=400,
            detail=(
                "No pending extension request for this report. "
                f"Current status: {report.extension_status}"
            )
        )

    try:
        updated_report = decide_extension(
            db=db,
            report_id=report_id,
            decision=data.decision
        )

        return updated_report

    except HTTPException:
        raise

    except Exception as error:
        db.rollback()

        print("EXTENSION DECISION ERROR:", str(error))

        raise HTTPException(
            status_code=500,
            detail="Error while processing extension decision"
        )


# =====================================================
# GET ALL FEEDBACK
# =====================================================

@router.get(
    "/feedback",
    response_model=List[FeedbackResponse]
)
def get_all_feedback(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    check_admin(current_user)
    check_admin_area(current_user)

    feedback_list = (
        db.query(Feedback)
        .join(
            WasteReport,
            Feedback.report_id == WasteReport.report_id
        )
        .join(
            User,
            WasteReport.user_id == User.user_id
        )
        .filter(
            same_area_filter(
                User.municipality_area_name,
                current_user.municipality_area_name
            )
        )
        .all()
    )

    return feedback_list