import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, zones, professions, levels, progress, subscription

app = FastAPI(title="CareerVerse API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/v1")
app.include_router(zones.router, prefix="/api/v1")
app.include_router(professions.router, prefix="/api/v1")
app.include_router(levels.router, prefix="/api/v1")
app.include_router(progress.router, prefix="/api/v1")
app.include_router(subscription.router, prefix="/api/v1")

@app.get("/health")
async def health():
    return {"status": "ok"}
