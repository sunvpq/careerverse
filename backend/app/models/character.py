from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Character(Base):
    __tablename__ = "characters"
    id = Column(Integer, primary_key=True, index=True)
    profession_id = Column(Integer, ForeignKey("professions.id"), nullable=False)
    sprite_url = Column(String, nullable=False)
    name = Column(String, nullable=False)

    profession = relationship("Profession", back_populates="characters")
