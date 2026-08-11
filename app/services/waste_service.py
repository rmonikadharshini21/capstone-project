from sqlalchemy.orm import Session
from app.models.waste import WasteReport
from app.schemas.waste import WasteReportCreate
def create_waste_report(db: Session, report: WasteReportCreate):
    new_report = WasteReport(
        user_id=report.user_id,
        waste_type=report.waste_type,
        location=report.location,
        description=report.description
    )
    db.add(new_report)
    db.commit()
    db.refresh(new_report)
    return new_report
def get_waste_reports(db: Session):
    return db.query(WasteReport).all()