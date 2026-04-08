from sqlalchemy import Column, Integer, ForeignKey, JSON, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class UserProgress(Base):
    __tablename__ = "user_progress"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    profession_id = Column(Integer, ForeignKey("professions.id"), nullable=False)
    completed_levels = Column(JSON, default=list)
    xp = Column(Integer, default=0)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    user = relationship("User", back_populates="progress")
    profession = relationship("Profession", back_populates="progress")
