from agents.base_agent import BaseAgent
from agents.junior_tab_finder import JuniorTabFinderAgent
from agents.tuning_assistant import TuningAssistantAgent

_TAB_KEYWORDS = ["tab", "chord", "song", "play", "learn", "tum hi ho", "channa", "kesariya",
                  "kabhi", "raabta", "kal ho", "maahi", "dil diyan", "phir bhi", "tera ban", "ve maahi"]
_TUNING_KEYWORDS = ["tune", "tuning", "sharp", "flat", "pitch", "frequency", "hz", "in tune",
                    "cents", "peg", "standard tuning", "drop d", "alternate"]


class SeniorGuitarTutorAgent(BaseAgent):
    """
    Senior orchestrator agent. Creates learning paths, gives guitar advice,
    and delegates to JuniorTabFinder or TuningAssistant as needed.
    """

    name = "Senior Guitar Tutor"
    role = "senior"
    system_prompt = """You are a senior guitar tutor with 20+ years of teaching experience, specializing in Bollywood/Hindi music.

Your personality:
- Patient, encouraging, and passionate about music
- You speak like a mentor — warm but direct
- You love Hindi film music and can relate Western guitar theory to Indian music

Your responsibilities:
1. Create personalized learning plans for students
2. Teach music theory in a simple, relatable way
3. Give practice tips and technique advice
4. Recommend songs based on skill level
5. Motivate students when they're struggling

When a student asks about specific songs/tabs — you delegate to your junior assistant and present their findings.
When tuning questions arise — you bring in your tuning specialist.

For general guitar advice, you answer directly with your 20+ years of wisdom.
Always end responses with a motivational nudge or next step."""

    def __init__(self):
        super().__init__()
        self._junior = JuniorTabFinderAgent()
        self._tuning = TuningAssistantAgent()

    def _classify(self, message: str) -> str:
        msg_lower = message.lower()
        if any(k in msg_lower for k in _TAB_KEYWORDS):
            return "tabs"
        if any(k in msg_lower for k in _TUNING_KEYWORDS):
            return "tuning"
        return "general"

    def answer(self, message: str, history: list[dict]) -> tuple[str, str, str]:
        """
        Returns (response_text, agent_name, agent_role).
        Delegates to junior/tuning agents when needed.
        """
        intent = self._classify(message)

        if intent == "tabs":
            try:
                response = self._junior.answer(message, history)
                return response, self._junior.name, self._junior.role
            except ValueError as e:
                return str(e), self.name, self.role

        if intent == "tuning":
            try:
                response = self._tuning.answer(message, history)
                return response, self._tuning.name, self._tuning.role
            except ValueError as e:
                return str(e), self.name, self.role

        # General — senior answers directly
        try:
            messages = history + [{"role": "user", "content": message}]
            response = self.call(messages, max_tokens=1024)
            return response, self.name, self.role
        except ValueError as e:
            return str(e), self.name, self.role
