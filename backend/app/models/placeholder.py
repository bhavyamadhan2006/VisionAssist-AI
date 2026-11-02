"""
Initial database model for Phase 1.

This lightweight table confirms that the
database can be initialized successfully.
"""

from sqlalchemy import Column, DateTime, Integer, String
from sqlalchemy.sql import func

from app.database import Base


class SystemInitLog(Base):
    """Initial verification table."""

    __tablename__ = "system_init_logs"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    status = Column(
        String,
        default="initialized"
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )