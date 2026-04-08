from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime, timedelta
from app.database import get_db
from app.models.user import User
from app.models.subscription import Subscription
from app.schemas.subscription import SubscriptionStatusResponse
from app.schemas.user import UserResponse
from app.dependencies import get_current_user

router = APIRouter(prefix="/subscription", tags=["subscription"])

@router.get("/status", response_model=SubscriptionStatusResponse)
async def get_status(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Subscription).where(Subscription.user_id == current_user.id)
    )
    sub = result.scalar_one_or_none()
    if not sub:
        return SubscriptionStatusResponse(type="free", expires_at=None)
    return SubscriptionStatusResponse(type=sub.type, expires_at=sub.expires_at)

@router.post("/upgrade", response_model=UserResponse)
async def upgrade(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    current_user.subscription_type = "premium"

    result = await db.execute(
        select(Subscription).where(Subscription.user_id == current_user.id)
    )
    sub = result.scalar_one_or_none()
    expires = datetime.utcnow() + timedelta(days=30)

    if sub:
        sub.type = "premium"
        sub.expires_at = expires
    else:
        sub = Subscription(user_id=current_user.id, type="premium", expires_at=expires)
        db.add(sub)

    await db.commit()
    await db.refresh(current_user)
    return current_user
