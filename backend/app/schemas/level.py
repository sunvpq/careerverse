from pydantic import BaseModel
from typing import Optional, List

class TaskResponse(BaseModel):
    id: int
    question: str
    options: List[str]
    model_config = {"from_attributes": True}

class LevelResponse(BaseModel):
    id: int
    profession_id: int
    order_index: int
    title: str
    type: str
    is_locked: bool = False
    model_config = {"from_attributes": True}

class LevelDetailResponse(BaseModel):
    id: int
    profession_id: int
    order_index: int
    title: str
    type: str
    teaching_text: str
    task: Optional[TaskResponse] = None
    model_config = {"from_attributes": True}

class SubmitAnswerRequest(BaseModel):
    answer: str

class SubmitAnswerResponse(BaseModel):
    correct: bool
    explanation: str
    xp_earned: int
    correct_answer: str
