from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.models.placeholder import SystemInitLog
from app.routes import health, vision, analysis


# Create database tables
Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="VisionAssist AI Backend",
    description=(
        "Indoor Navigation Assistant for "
        "the Visually Impaired - Core API"
    ),
    version="1.0.0-phase1",
)


# Allow the React frontend to communicate
# with the FastAPI backend.
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Register health routes
app.include_router(
    health.router,
    prefix="/api",
    tags=["System Health"]
)


# Register vision routes
app.include_router(
    vision.router,
    prefix="/api",
    tags=["Vision Analysis"]
)


# Register image analysis routes
app.include_router(
    analysis.router,
    prefix="/api",
    tags=["AI Image Analysis"]
)


@app.get("/")
def root():
    return {
        "project": "VisionAssist AI",
        "description": (
            "Backend services running. "
            "Visit /api/health for system status."
        )
    }