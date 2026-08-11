from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.auth import router as auth_router
from app.api.waste import router as waste_router

from app.core.database import Base, engine
from app.models.user import User
from app.models.waste import WasteReport


Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="Smart Waste Management System",
    description="Backend API for Smart Waste Management",
    version="1.0.0"
)


# Allow React frontend to communicate with FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth_router)
app.include_router(waste_router)


@app.get("/")
def home():
    return {
        "message": "Smart Waste Management System Backend is running"
    }