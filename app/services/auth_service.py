from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user import UserCreate
from app.core.security import pwd_context
def register_user(db: Session, user_data: UserCreate):
    existing_user = db.query(User).filter(
        User.email == user_data.email
    ).first()
    if existing_user:
        return None
    hashed_password = pwd_context.hash(user_data.password)
    new_user = User(
        full_name=user_data.full_name,
        email=user_data.email,
        password=hashed_password,
        phone=user_data.phone,
        address=user_data.address,
        municipality_area_name=user_data.municipality_area_name,
        municipality_number=user_data.municipality_number,
        role="PUBLIC"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user
def authenticate_user(
    db: Session,
    email: str,
    password: str
):
    user = db.query(User).filter(
        User.email == email
    ).first()
    if not user:
        return None
    if not pwd_context.verify(password, user.password):
        return None
    return user