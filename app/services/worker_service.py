from fastapi import HTTPException
from sqlalchemy.orm import Session
from datetime import datetime

from app.models.waste import WasteReport


# =====================================================
# GET WORKER TASKS
# =====================================================

def get_assigned_tasks(
    db: Session,
    worker_id: int
):
    return (
        db.query(WasteReport)
        .filter(
            WasteReport.worker_id == worker_id
        )
        .all()
    )


# =====================================================
# UPDATE TASK STATUS
# =====================================================

def update_task_status(
    db: Session,
    report_id: int,
    worker_id: int,
    new_status: str
):
    report = (
        db.query(WasteReport)
        .filter(
            WasteReport.report_id == report_id,
            WasteReport.worker_id == worker_id
        )
        .first()
    )

    if not report:
        raise HTTPException(
            status_code=404,
            detail="Task not found for this worker"
        )

    allowed_statuses = [
        "ASSIGNED",
        "IN_PROGRESS",
        "COMPLETED"
    ]

    new_status = new_status.upper()

    if new_status not in allowed_statuses:
        raise HTTPException(
            status_code=400,
            detail="Invalid task status"
        )

    if report.assignment_status != "ACCEPTED":
        raise HTTPException(
            status_code=400,
            detail="Worker must accept the assignment first"
        )

    if report.status == "COMPLETED":
        raise HTTPException(
            status_code=400,
            detail="Completed task cannot be changed"
        )

    report.status = new_status

    db.commit()
    db.refresh(report)

    return report


# =====================================================
# ACCEPT OR REJECT ASSIGNMENT
# =====================================================

def decide_assignment(
    db: Session,
    report_id: int,
    worker_id: int,
    decision: str,
    rejection_reason: str = None
):
    report = (
        db.query(WasteReport)
        .filter(
            WasteReport.report_id == report_id,
            WasteReport.worker_id == worker_id
        )
        .first()
    )

    if not report:
        raise HTTPException(
            status_code=404,
            detail="Task not found for this worker"
        )

    decision = decision.upper()

    if decision not in ["ACCEPT", "REJECT"]:
        raise HTTPException(
            status_code=400,
            detail="Decision must be ACCEPT or REJECT"
        )

    if decision == "ACCEPT":
        report.assignment_status = "ACCEPTED"
        report.rejection_reason = None

        if report.status == "ASSIGNED":
            report.status = "ASSIGNED"

    else:
        if not rejection_reason:
            raise HTTPException(
                status_code=400,
                detail="Rejection reason is required"
            )

        report.assignment_status = "REJECTED"
        report.rejection_reason = rejection_reason
        report.status = "PENDING"

    db.commit()
    db.refresh(report)

    return report


# =====================================================
# REQUEST EXTENSION
# =====================================================

def request_extension(
    db: Session,
    report_id: int,
    worker_id: int,
    proposed_completion_at: datetime,
    extension_reason: str
):
    report = (
        db.query(WasteReport)
        .filter(
            WasteReport.report_id == report_id,
            WasteReport.worker_id == worker_id
        )
        .first()
    )

    if not report:
        raise HTTPException(
            status_code=404,
            detail="Task not found for this worker"
        )

    if report.assignment_status != "ACCEPTED":
        raise HTTPException(
            status_code=400,
            detail="Assignment must be accepted first"
        )

    if report.status == "COMPLETED":
        raise HTTPException(
            status_code=400,
            detail="Completed task cannot be extended"
        )

    if report.extension_status == "PENDING":
        raise HTTPException(
            status_code=400,
            detail="Extension request is already pending"
        )

    if not extension_reason or len(extension_reason.strip()) < 5:
        raise HTTPException(
            status_code=400,
            detail="Please provide a valid extension reason"
        )

    if proposed_completion_at <= datetime.now():
        raise HTTPException(
            status_code=400,
            detail="Proposed completion time must be in the future"
        )

    report.extension_reason = extension_reason.strip()
    report.proposed_completion_at = proposed_completion_at
    report.extension_status = "PENDING"

    db.commit()
    db.refresh(report)

    return report


# =====================================================
# ADMIN DECIDES EXTENSION
# =====================================================

def decide_extension(
    db: Session,
    report_id: int,
    decision: str
):
    report = (
        db.query(WasteReport)
        .filter(
            WasteReport.report_id == report_id
        )
        .first()
    )

    if not report:
        raise HTTPException(
            status_code=404,
            detail="Report not found"
        )

    decision = decision.upper()

    if decision not in ["APPROVE", "REJECT"]:
        raise HTTPException(
            status_code=400,
            detail="Decision must be APPROVE or REJECT"
        )

    if report.extension_status != "PENDING":
        raise HTTPException(
            status_code=400,
            detail=(
                "No pending extension request. "
                f"Current status: {report.extension_status}"
            )
        )

    if decision == "APPROVE":
        report.expected_completion_at = (
            report.proposed_completion_at
        )
        report.extension_status = "APPROVED"

    else:
        report.extension_status = "REJECTED"

    db.commit()
    db.refresh(report)

    return report