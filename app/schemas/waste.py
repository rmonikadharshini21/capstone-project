
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


# ==============================
# CREATE WASTE REPORT
# ==============================

class WasteReportCreate(BaseModel):
    waste_type: str
    location: str
    description: str


# ==============================
# ASSIGN WORKER
# ==============================

class AssignWorker(BaseModel):
    report_id: int
    worker_id: int

    # Expected completion date set by admin
    expected_completion_at: Optional[datetime] = None


# ==============================
# WORKER ACCEPT / REJECT
# ==============================

class WorkerAssignmentDecision(BaseModel):
    decision: str
    rejection_reason: Optional[str] = None


# ==============================
# EXTENSION REQUEST
# ==============================

class ExtensionRequest(BaseModel):
    proposed_completion_at: datetime
    extension_reason: str = Field(
        ...,
        min_length=5
    )


# ==============================
# ADMIN EXTENSION DECISION
# ==============================

class ExtensionDecision(BaseModel):
    decision: str
    review_message: Optional[str] = None


# ==============================
# WASTE REPORT RESPONSE
# ==============================

class WasteReportResponse(BaseModel):
    report_id: int
    user_id: int
    worker_id: Optional[int] = None

    waste_type: str
    location: str
    description: str

    ai_category: Optional[str] = None
    priority_level: Optional[str] = None
    status: str

    assignment_status: Optional[str] = "WAITING"
    rejection_reason: Optional[str] = None

    # Extension details
    expected_completion_at: Optional[datetime] = None
    extension_reason: Optional[str] = None
    proposed_completion_at: Optional[datetime] = None
    extension_status: Optional[str] = "NONE"

    created_at: datetime

    worker_name: Optional[str] = None
    worker_phone: Optional[str] = None

    admin_name: Optional[str] = None
    admin_phone: Optional[str] = None

    class Config:
        from_attributes = True


# ==============================
# FEEDBACK CREATE
# ==============================

class FeedbackCreate(BaseModel):
    report_id: Optional[int] = None
    rating: int = Field(
        ...,
        ge=1,
        le=5
    )
    message: str


# ==============================
# FEEDBACK RESPONSE
# ==============================

class FeedbackResponse(BaseModel):
    feedback_id: int
    user_id: int
    report_id: Optional[int] = None

    rating: int
    message: str
    created_at: datetime

    class Config:
        from_attributes = True