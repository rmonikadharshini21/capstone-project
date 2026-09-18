from sqlalchemy.orm import Session
from app.models.waste import WasteReport
from app.schemas.waste import WasteReportCreate

def create_waste_report(db: Session, report_data: WasteReportCreate, user_id: int):
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
    # Fetch only the reports that belong to the logged-in user
    return db.query(WasteReport).filter(WasteReport.user_id == user_id).all()