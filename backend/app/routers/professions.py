from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from typing import List, Optional
from app.database import get_db
from app.models.profession import Profession
from app.models.user import User
from app.schemas.profession import ProfessionResponse, ProfessionDetailResponse
from app.dependencies import get_current_user

router = APIRouter(prefix="/professions", tags=["professions"])

@router.get("", response_model=List[ProfessionResponse])
async def get_professions(
    zone_id: Optional[int] = Query(None),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    query = select(Profession)
    if zone_id:
        query = query.where(Profession.zone_id == zone_id)

    result = await db.execute(query)
    professions = result.scalars().all()

    response = []
    for i, p in enumerate(professions):
        is_locked = False
        if current_user.subscription_type == "free" and i >= 2:
            is_locked = True
        response.append(ProfessionResponse(
            id=p.id, name=p.name, zone_id=p.zone_id,
            difficulty=p.difficulty, description=p.description,
            chibi_emoji=p.chibi_emoji, is_locked=is_locked
        ))
    return response

@router.get("/{profession_id}", response_model=ProfessionDetailResponse)
async def get_profession(
    profession_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Profession)
        .options(selectinload(Profession.characters))
        .where(Profession.id == profession_id)
    )
    profession = result.scalar_one_or_none()
    if not profession:
        raise HTTPException(status_code=404, detail="Profession not found")
    return profession
