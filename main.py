from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import auth, waste, admin, worker, ai

app = FastAPI(
    title="Smart Waste Management API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://capstone-project-1-rt16.onrender.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {
        "message": "Smart Waste Management API is working"
    }


app.include_router(auth.router)
app.include_router(waste.router)
app.include_router(admin.router)
app.include_router(worker.router)
app.include_router(ai.router)