
from sqlalchemy.orm import Session, aliased
from app.models.waste import WasteReport
from app.models.user import User
from app.schemas.waste import WasteReportCreate


def create_waste_report(
    db: Session,
    report_data: WasteReportCreate,
    user_id: int
):
    new_report = WasteReport(
        user_id=user_id,
        waste_type=report_data.waste_type,
        location=report_data.location,
        description=report_data.description
    )

    db.add(new_report)
    db.commit()
    db.refresh(new_report)

    return new_report


def get_waste_reports(db: Session, user_id: int):
    Worker = aliased(User)
    Admin = aliased(User)

    reports = (
        db.query(
            WasteReport,
            Worker.full_name.label("worker_name"),
            Worker.phone.label("worker_phone"),
            Admin.full_name.label("admin_name"),
            Admin.phone.label("admin_phone")
        )
        .join(
            User,
            WasteReport.user_id == User.user_id
        )
        .outerjoin(
            Worker,
            WasteReport.worker_id == Worker.user_id
        )
        .outerjoin(
            Admin,
            (
                Admin.role == "ADMIN"
            ) &
            (
                Admin.municipality_area_name
                == User.municipality_area_name
            )
        )
        .filter(
            WasteReport.user_id == user_id
        )
        .all()
    )

    result = []

    for report, worker_name, worker_phone, admin_name, admin_phone in reports:
        report_data = {
            "report_id": report.report_id,
            "user_id": report.user_id,
            "worker_id": report.worker_id,
            "waste_type": report.waste_type,
            "location": report.location,
            "description": report.description,
            "ai_category": report.ai_category,
            "priority_level": report.priority_level,
            "status": report.status,
            "created_at": report.created_at,
            "worker_name": worker_name,
            "worker_phone": worker_phone,
            "admin_name": admin_name,
            "admin_phone": admin_phone
        }

        result.append(report_data)

    return result