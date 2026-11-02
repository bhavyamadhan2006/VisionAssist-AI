from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.health import HealthResponse

router = APIRouter()


@router.get(
    "/health",
    response_model=HealthResponse
)
def check_health(
    db: Session = Depends(get_db)
):
    """Check API and database health."""

    db_status = "connected"

    try:
        db.execute(text("SELECT 1"))
    except Exception:
        db_status = "disconnected"

    return HealthResponse(
        status="ok",
        message="VisionAssist AI backend is running",
        database=db_status,
        version="1.0.0-phase1"
    )