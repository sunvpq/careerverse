from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.progress import UserProgress
from app.models.level import Level
from app.models.task import Task

async def get_or_create_progress(db: AsyncSession, user_id: int, profession_id: int) -> UserProgress:
    result = await db.execute(
        select(UserProgress).where(
            UserProgress.user_id == user_id,
            UserProgress.profession_id == profession_id
        )
    )
    progress = result.scalar_one_or_none()
    if not progress:
        progress = UserProgress(
            user_id=user_id,
            profession_id=profession_id,
            completed_levels=[],
            xp=0
        )
        db.add(progress)
        await db.flush()
    return progress

async def submit_answer(db: AsyncSession, user_id: int, level_id: int, answer: str):
    level_result = await db.execute(select(Level).where(Level.id == level_id))
    level = level_result.scalar_one_or_none()
    if not level:
        return None

    task_result = await db.execute(select(Task).where(Task.level_id == level_id))
    task = task_result.scalar_one_or_none()
    if not task:
        return None

    correct = answer == task.correct_answer
    xp_earned = 50 if correct else 10

    progress = await get_or_create_progress(db, user_id, level.profession_id)

    completed = list(progress.completed_levels or [])
    if correct and level_id not in completed:
        completed.append(level_id)
        progress.completed_levels = completed

    progress.xp = (progress.xp or 0) + xp_earned
    await db.commit()

    return {
        "correct": correct,
        "explanation": task.explanation,
        "xp_earned": xp_earned,
        "correct_answer": task.correct_answer
    }
