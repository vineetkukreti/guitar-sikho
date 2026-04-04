from fastapi import APIRouter
from pydantic import BaseModel
from agents.senior_tutor import SeniorGuitarTutorAgent

router = APIRouter()
_tutor = SeniorGuitarTutorAgent()


class ChatRequest(BaseModel):
    message: str
    history: list[dict] = []


class ChatResponse(BaseModel):
    response: str
    agent: str
    agent_role: str


@router.post("/", response_model=ChatResponse)
def chat(req: ChatRequest):
    response, agent_name, agent_role = _tutor.answer(req.message, req.history)
    return ChatResponse(response=response, agent=agent_name, agent_role=agent_role)
