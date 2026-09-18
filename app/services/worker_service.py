from sqlalchemy.orm import Session
from app.models.waste import WasteReport

def get_assigned_tasks(db: Session, worker_id: int):
    return db.query(WasteReport).filter(WasteReport.worker_id == worker_id).all()

def update_task_status(db: Session, report_id: int, worker_id: int, new_status: str):
    report = db.query(WasteReport).filter(
        WasteReport.report_id == report_id,
        WasteReport.worker_id == worker_id
    ).first()
    
    if not report:
        return None
        
    report.status = new_status.upper()
    db.commit()
    db.refresh(report)
    return report