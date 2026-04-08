from sqlalchemy import Column, Integer, String, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.database import Base

class Profession(Base):
    __tablename__ = "professions"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    zone_id = Column(Integer, ForeignKey("zones.id"), nullable=False)
    difficulty = Column(Integer, nullable=False)
    description = Column(Text, nullable=False)
    chibi_emoji = Column(String, nullable=False)

    zone = relationship("Zone", back_populates="professions")
    levels = relationship("Level", back_populates="profession")
    characters = relationship("Character", back_populates="profession")
    progress = relationship("UserProgress", back_populates="profession")
