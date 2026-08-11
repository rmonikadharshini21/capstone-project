from pydantic import BaseModel, EmailStr
class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    phone: str
    address: str
    municipality_area_name: str
    municipality_number: str
class UserResponse(BaseModel):
    user_id: int
    full_name: str
    email: EmailStr
    phone: str
    address: str
    municipality_area_name: str
    municipality_number: str
    role: str
    class Config:
        from_attributes = True