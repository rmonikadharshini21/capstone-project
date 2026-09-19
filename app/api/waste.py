
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db

from app.schemas.waste import (
    WasteReportCreate,
    WasteReportResponse,
    FeedbackCreate,
    FeedbackResponse
)

from app.services.waste_service import (
    create_waste_report,
    get_waste_reports
)

from app.api.deps import get_current_user
from app.models.user import User
from app.models.waste import WasteReport, Feedback


router = APIRouter(
    prefix="/waste",
    tags=["Waste Management"]
)


@router.post(
    "/report",
    response_model=WasteReportResponse
)
def report_waste(
    report: WasteReportCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return create_waste_report(
        db,
        report,
        current_user.user_id
    )


@router.get(
    "/reports",
    response_model=list[WasteReportResponse]
)
def view_waste_reports(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_waste_reports(
        db,
        current_user.user_id
    )


@router.post(
    "/feedback",
    response_model=FeedbackResponse
)
def submit_feedback(
    feedback_data: FeedbackCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if feedback_data.report_id is not None:
        report = (
            db.query(WasteReport)
            .filter(
                WasteReport.report_id == feedback_data.report_id,
                WasteReport.user_id == current_user.user_id
            )
            .first()
        )

        if not report:
            raise HTTPException(
                status_code=404,
                detail="Report not found or does not belong to you"
            )

        if report.status.upper() != "COMPLETED":
            raise HTTPException(
                status_code=400,
                detail="Feedback can be submitted after report completion"
            )

    new_feedback = Feedback(
        user_id=current_user.user_id,
        report_id=feedback_data.report_id,
        rating=feedback_data.rating,
        message=feedback_data.message
    )

    db.add(new_feedback)
    db.commit()
    db.refresh(new_feedback)

    return new_feedback