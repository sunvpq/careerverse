from pydantic import BaseModel

class ZoneResponse(BaseModel):
    id: int
    name: str
    color_code: str
    icon_emoji: str
    is_locked_free: bool

    model_config = {"from_attributes": True}
