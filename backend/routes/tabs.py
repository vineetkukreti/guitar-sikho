from fastapi import APIRouter, HTTPException, Query
from services.tab_service import get_all_tabs, get_tab_by_slug, search_tabs

router = APIRouter()


@router.get("/")
def list_tabs():
    return {"tabs": get_all_tabs()}


@router.get("/search")
def search(q: str = Query(..., min_length=1)):
    results = search_tabs(q)
    return {"results": results, "count": len(results)}


@router.get("/{slug}")
def get_tab(slug: str):
    tab = get_tab_by_slug(slug)
    if not tab:
        raise HTTPException(status_code=404, detail=f"Tab '{slug}' not found")
    return tab
