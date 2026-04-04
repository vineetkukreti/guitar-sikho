from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import FRONTEND_URL
from routes import chat, tabs, tuner, lessons

app = FastAPI(title="Guitar Learning API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL, "http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(tabs.router, prefix="/api/tabs", tags=["tabs"])
app.include_router(lessons.router, prefix="/api/lessons", tags=["lessons"])
app.include_router(chat.router, prefix="/api/chat", tags=["chat"])
app.include_router(tuner.router, tags=["tuner"])


@app.get("/")
def root():
    return {"message": "Guitar Learning API 🎸", "docs": "/docs"}
