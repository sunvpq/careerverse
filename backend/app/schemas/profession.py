from pydantic import BaseModel
from typing import Optional, List

class CharacterResponse(BaseModel):
    id: int
    name: str
    sprite_url: str
    model_config = {"from_attributes": True}

class ProfessionResponse(BaseModel):
    id: int
    name: str
    zone_id: int
    difficulty: int
    description: str
    chibi_emoji: str
    is_locked: bool = False
    model_config = {"from_attributes": True}

class ProfessionDetailResponse(BaseModel):
    id: int
    name: str
    zone_id: int
    difficulty: int
    description: str
    chibi_emoji: str
    characters: List[CharacterResponse] = []
    model_config = {"from_attributes": True}
