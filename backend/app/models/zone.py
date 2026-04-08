from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.orm import relationship
from app.database import Base

class Zone(Base):
    __tablename__ = "zones"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    color_code = Column(String, nullable=False)
    icon_emoji = Column(String, nullable=False)
    is_locked_free = Column(Boolean, default=False)

    professions = relationship("Profession", back_populates="zone")
