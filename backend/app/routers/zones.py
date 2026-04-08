from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from app.database import get_db
from app.models.zone import Zone
from app.models.user import User
from app.schemas.zone import ZoneResponse
from app.dependencies import get_current_user

router = APIRouter(prefix="/zones", tags=["zones"])

@router.get("", response_model=List[ZoneResponse])
async def get_zones(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Zone))
    zones = result.scalars().all()
    return zones
