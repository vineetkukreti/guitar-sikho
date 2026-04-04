import json, os
from fastapi import APIRouter, HTTPException

router = APIRouter()
_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "lessons.json")


def _load():
    with open(_PATH) as f:
        return json.load(f)


@router.get("/")
def list_lessons():
    return {"lessons": _load()}


@router.get("/{lesson_id}")
def get_lesson(lesson_id: str):
    lessons = _load()
    lesson = next((l for l in lessons if l["id"] == lesson_id), None)
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    return lesson
