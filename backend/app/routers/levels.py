from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from typing import List, Optional
from app.database import get_db
from app.models.level import Level
from app.models.task import Task
from app.models.user import User
from app.schemas.level import LevelResponse, LevelDetailResponse, SubmitAnswerRequest, SubmitAnswerResponse, TaskResponse
from app.dependencies import get_current_user
from app.services.gameplay_service import submit_answer

router = APIRouter(prefix="/levels", tags=["levels"])

@router.get("", response_model=List[LevelResponse])
async def get_levels(
    profession_id: Optional[int] = Query(None),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    query = select(Level).order_by(Level.order_index)
    if profession_id:
        query = query.where(Level.profession_id == profession_id)

    result = await db.execute(query)
    levels = result.scalars().all()

    response = []
    for level in levels:
        is_locked = False
        if current_user.subscription_type == "free" and level.order_index > 3:
            is_locked = True
        response.append(LevelResponse(
            id=level.id, profession_id=level.profession_id,
            order_index=level.order_index, title=level.title,
            type=level.type, is_locked=is_locked
        ))
    return response

@router.get("/{level_id}", response_model=LevelDetailResponse)
async def get_level(
    level_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Level).options(selectinload(Level.tasks)).where(Level.id == level_id)
    )
    level = result.scalar_one_or_none()
    if not level:
        raise HTTPException(status_code=404, detail="Level not found")

    if current_user.subscription_type == "free" and level.order_index > 3:
        raise HTTPException(status_code=403, detail="premium_required")

    task = level.tasks[0] if level.tasks else None
    task_response = None
    if task:
        task_response = TaskResponse(id=task.id, question=task.question, options=task.options)

    return LevelDetailResponse(
        id=level.id, profession_id=level.profession_id,
        order_index=level.order_index, title=level.title,
        type=level.type, teaching_text=level.teaching_text,
        task=task_response
    )

@router.post("/{level_id}/submit", response_model=SubmitAnswerResponse)
async def submit_level(
    level_id: int,
    data: SubmitAnswerRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    level_result = await db.execute(select(Level).where(Level.id == level_id))
    level = level_result.scalar_one_or_none()
    if not level:
        raise HTTPException(status_code=404, detail="Level not found")

    if current_user.subscription_type == "free" and level.order_index > 3:
        raise HTTPException(status_code=403, detail="premium_required")

    result = await submit_answer(db, current_user.id, level_id, data.answer)
    if not result:
        raise HTTPException(status_code=404, detail="Task not found")
    return result
