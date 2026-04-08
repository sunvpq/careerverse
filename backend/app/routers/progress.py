from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from app.database import get_db
from app.models.progress import UserProgress
from app.models.user import User
from app.schemas.progress import ProfessionProgressResponse, AllProgressResponse
from app.dependencies import get_current_user

router = APIRouter(prefix="/progress", tags=["progress"])

@router.get("/me", response_model=AllProgressResponse)
async def get_my_progress(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(UserProgress).where(UserProgress.user_id == current_user.id)
    )
    all_progress = result.scalars().all()
    total_xp = sum(p.xp for p in all_progress)

    return AllProgressResponse(
        total_xp=total_xp,
        professions=[
            ProfessionProgressResponse(
                profession_id=p.profession_id,
                completed_levels=p.completed_levels or [],
                xp=p.xp,
                updated_at=p.updated_at
            )
            for p in all_progress
        ]
    )

@router.get("/me/{profession_id}", response_model=ProfessionProgressResponse)
async def get_profession_progress(
    profession_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(UserProgress).where(
            UserProgress.user_id == current_user.id,
            UserProgress.profession_id == profession_id
        )
    )
    progress = result.scalar_one_or_none()
    if not progress:
        raise HTTPException(status_code=404, detail="No progress found")
    return ProfessionProgressResponse(
        profession_id=progress.profession_id,
        completed_levels=progress.completed_levels or [],
        xp=progress.xp,
        updated_at=progress.updated_at
    )
