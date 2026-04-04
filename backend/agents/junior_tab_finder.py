from agents.base_agent import BaseAgent
from services.tab_service import search_tabs, get_all_tabs


class JuniorTabFinderAgent(BaseAgent):
    """
    Junior agent specialized in finding and explaining guitar tabs for Hindi songs.
    Called by the SeniorTutorAgent when tab information is needed.
    """

    name = "Junior Tab Finder"
    role = "junior"
    system_prompt = """You are a junior music assistant at a guitar learning app. Your specialty is Hindi Bollywood guitar tabs.

Your job:
1. Find tabs for Hindi songs when asked
2. Explain chord fingerings clearly
3. Break down tab notation for beginners
4. Suggest similar songs if the requested song isn't available

When presenting tabs:
- Always mention capo position if needed
- Explain the chord progression in plain language
- Give 1-2 beginner tips specific to the song
- Be enthusiastic and encouraging — you love Bollywood music!

You report to the Senior Guitar Tutor. Be concise but thorough in your tab explanations."""

    def find_tabs_for_query(self, query: str) -> str:
        """Search local DB and format result as context for LLM."""
        results = search_tabs(query)
        if not results:
            all_titles = [t["title"] for t in get_all_tabs()]
            return f"No tabs found for '{query}'. Available songs: {', '.join(all_titles)}"

        song = results[0]
        return (
            f"Found: {song['title']} by {song['artist']} ({song.get('film', '')})\n"
            f"Difficulty: {song['difficulty']} | Capo: {song['capo']} | BPM: {song['bpm']}\n"
            f"Chords: {', '.join(song['chords'])}\n"
            f"Strumming: {song['strumming_pattern']}\n"
            f"Description: {song['description']}\n"
            f"Intro Tab:\n{song['intro_tab']}\n"
            f"Verse Tab:\n{song['verse_tab']}\n"
            f"Tips: {'; '.join(song['tips'])}"
        )

    def answer(self, query: str, history: list[dict]) -> str:
        tab_context = self.find_tabs_for_query(query)
        messages = history + [
            {
                "role": "user",
                "content": f"Tab database result:\n{tab_context}\n\nUser question: {query}",
            }
        ]
        return self.call(messages, max_tokens=800)
