from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from services.pitch_detection import analyze_audio
import json

router = APIRouter()


@router.websocket("/ws/tuner")
async def tuner_ws(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            raw = await websocket.receive_bytes()
            result = analyze_audio(raw)
            await websocket.send_text(json.dumps(result))
    except WebSocketDisconnect:
        pass
    except Exception as e:
        await websocket.close(code=1011, reason=str(e))
