
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.waste import WasteReport, Feedback

from app.schemas.waste import (
    WasteReportResponse,
    WorkerAssignmentDecision,
    ExtensionRequest,
    FeedbackResponse
)

from app.services.worker_service import (
    get_assigned_tasks,
    update_task_status,
    decide_assignment,
    request_extension
)


router = APIRouter(
    prefix="/worker",
    tags=["Worker Operations"]
)


# ==============================
# CHECK WORKER
# ==============================

def check_worker(user: User):
    if user.role != "WORKER":
        raise HTTPException(
            status_code=403,
            detail="Worker access required"
        )


# ==============================
# GET ASSIGNED TASKS
# ==============================

@router.get(
    "/tasks",
    response_model=list[WasteReportResponse]
)
def get_worker_tasks(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    check_worker(current_user)

    return get_assigned_tasks(
        db=db,
        worker_id=current_user.user_id
    )


# ==============================
# ACCEPT / REJECT ASSIGNMENT
# ==============================

@router.put(
    "/tasks/{report_id}/decision",
    response_model=WasteReportResponse
)
def assignment_decision(
    report_id: int,
    data: WorkerAssignmentDecision,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    check_worker(current_user)

    report, error = decide_assignment(
        db=db,
        report_id=report_id,
        worker_id=current_user.user_id,
        decision=data.decision,
        rejection_reason=data.rejection_reason
    )

    if error:
        raise HTTPException(
            status_code=400,
            detail=error
        )

    return report


# ==============================
# UPDATE TASK STATUS
# ==============================

@router.put(
    "/tasks/{report_id}/status",
    response_model=WasteReportResponse
)
def change_task_status(
    report_id: int,
    new_status: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    check_worker(current_user)

    report = update_task_status(
        db=db,
        report_id=report_id,
        worker_id=current_user.user_id,
        new_status=new_status
    )

    if not report:
        raise HTTPException(
            status_code=400,
            detail="Unable to update task status"
        )

    return report


# ==============================
# REQUEST EXTENSION
# ==============================

@router.post(
    "/tasks/{report_id}/extension",
    response_model=WasteReportResponse
)
def create_extension_request(
    report_id: int,
    data: ExtensionRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    check_worker(current_user)

    report, error = request_extension(
        db=db,
        report_id=report_id,
        worker_id=current_user.user_id,
        proposed_completion_at=data.proposed_completion_at,
        extension_reason=data.extension_reason
    )

    if error:
        raise HTTPException(
            status_code=400,
            detail=error
        )

    return report


# ==============================
# GET WORKER FEEDBACK
# ==============================

@router.get(
    "/feedback",
    response_model=list[FeedbackResponse]
)
def get_worker_feedback(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    check_worker(current_user)

    feedback_list = (
        db.query(Feedback)
        .join(
            WasteReport,
            Feedback.report_id == WasteReport.report_id
        )
        .filter(
            WasteReport.worker_id == current_user.user_id
        )
        .all()
    )

    return feedback_list