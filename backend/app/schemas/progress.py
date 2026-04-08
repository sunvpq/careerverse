from pydantic import BaseModel
from typing import List
from datetime import datetime

class ProfessionProgressResponse(BaseModel):
    profession_id: int
    completed_levels: List[int]
    xp: int
    updated_at: datetime
    model_config = {"from_attributes": True}

class AllProgressResponse(BaseModel):
    total_xp: int
    professions: List[ProfessionProgressResponse]
