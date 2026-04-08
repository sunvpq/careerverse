from sqlalchemy import Column, Integer, String, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.database import Base

class Level(Base):
    __tablename__ = "levels"
    id = Column(Integer, primary_key=True, index=True)
    profession_id = Column(Integer, ForeignKey("professions.id"), nullable=False)
    order_index = Column(Integer, nullable=False)
    title = Column(String, nullable=False)
    type = Column(String, nullable=False)  # quiz/choice/timed
    teaching_text = Column(Text, nullable=False)

    profession = relationship("Profession", back_populates="levels")
    tasks = relationship("Task", back_populates="level")
