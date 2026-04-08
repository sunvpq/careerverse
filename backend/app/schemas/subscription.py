from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class SubscriptionStatusResponse(BaseModel):
    type: str
    expires_at: Optional[datetime] = None
    model_config = {"from_attributes": True}
