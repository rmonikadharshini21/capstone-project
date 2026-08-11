from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.user import UserCreate, UserResponse
from app.services.auth_service import register_user, authenticate_user
router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)
@router.post("/register", response_model=UserResponse)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    user = register_user(db, user_data)
    if user is None:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )
    return user
@router.post("/login", response_model=UserResponse)
def login(
    email: str,
    password: str,
    db: Session = Depends(get_db)
):
    user = authenticate_user(db, email, password)
    if user is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )
    return user