import anthropic
from config import ANTHROPIC_API_KEY

MODEL = "claude-sonnet-4-6"


class BaseAgent:
    """Base class for all Guitar Learning agents."""

    name: str = "Agent"
    role: str = "agent"
    system_prompt: str = "You are a helpful assistant."

    def __init__(self):
        self._client = None

    @property
    def client(self):
        if self._client is None:
            if not ANTHROPIC_API_KEY or ANTHROPIC_API_KEY == "your_api_key_here":
                raise ValueError("ANTHROPIC_API_KEY not set. Add it to your .env file.")
            self._client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)
        return self._client

    def call(self, messages: list[dict], max_tokens: int = 1024) -> str:
        response = self.client.messages.create(
            model=MODEL,
            max_tokens=max_tokens,
            system=self.system_prompt,
            messages=messages,
        )
        return response.content[0].text
