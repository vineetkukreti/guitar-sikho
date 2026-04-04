import json
import os
from typing import Optional

_DATA_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "hindi_tabs.json")
_tabs_cache: Optional[list] = None


def _load() -> list:
    global _tabs_cache
    if _tabs_cache is None:
        with open(_DATA_PATH, "r", encoding="utf-8") as f:
            _tabs_cache = json.load(f)
    return _tabs_cache


def get_all_tabs() -> list:
    return _load()


def get_tab_by_slug(slug: str) -> Optional[dict]:
    return next((t for t in _load() if t["slug"] == slug), None)


def search_tabs(query: str) -> list:
    q = query.lower()
    return [
        t for t in _load()
        if q in t["title"].lower()
        or q in t["artist"].lower()
        or q in t.get("film", "").lower()
    ]
