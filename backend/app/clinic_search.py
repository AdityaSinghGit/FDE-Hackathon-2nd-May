"""Nearby clinic discovery via optional MCP HTTP bridge or Google Custom Search."""

import logging
from typing import Any

import httpx

from app.config import settings
from app.schemas import ClinicResult

logger = logging.getLogger(__name__)


async def search_nearby_clinics(address: str, locale: str | None) -> tuple[list[ClinicResult], str]:
    """
    Fetch clinic-related web results for dashboard display.

    Returns:
        (results, status) where status is ok | disabled | error
    """
    addr = address.strip()
    if len(addr) < 4:
        return [], "skipped"

    if settings.clinic_search_mcp_http_url:
        return await _search_via_mcp_http(addr, locale)

    if settings.google_cse_api_key and settings.google_cse_cx:
        return await _search_google_cse(addr, locale)

    logger.info("Clinic search: no MCP URL or Google CSE configured; skipping.")
    return [], "disabled"


async def _search_via_mcp_http(address: str, locale: str | None) -> tuple[list[ClinicResult], str]:
    """POST to an MCP-compatible HTTP adapter if deployed."""
    query = _build_query(address, locale)
    payload: dict[str, Any] = {"query": query, "address": address, "locale": locale}
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            r = await client.post(settings.clinic_search_mcp_http_url, json=payload)
            r.raise_for_status()
            body = r.json()
    except Exception as e:
        logger.warning("MCP HTTP clinic search failed: %s", e)
        return [], "error"

    items = body.get("results") or body.get("items") or []
    return _normalize_hits(items), "ok"


async def _search_google_cse(address: str, locale: str | None) -> tuple[list[ClinicResult], str]:
    """Use Google Custom Search JSON API (programmatic Google Search)."""
    query = _build_query(address, locale)
    params = {
        "key": settings.google_cse_api_key,
        "cx": settings.google_cse_cx,
        "q": query,
        "num": 8,
    }
    try:
        async with httpx.AsyncClient(timeout=25.0) as client:
            r = await client.get("https://www.googleapis.com/customsearch/v1", params=params)
            r.raise_for_status()
            data = r.json()
    except Exception as e:
        logger.warning("Google CSE clinic search failed: %s", e)
        return [], "error"

    items = data.get("items") or []
    hits: list[ClinicResult] = []
    for it in items[:8]:
        hits.append(
            ClinicResult(
                title=str(it.get("title") or "Result"),
                snippet=it.get("snippet"),
                url=it.get("link"),
            )
        )
    return hits, "ok"


def _build_query(address: str, locale: str | None) -> str:
    loc = (locale or "").strip()
    base = f'walk-in clinic OR urgent care OR general practitioner near "{address}"'
    if loc:
        return f"{base} {loc}"
    return base


def _normalize_hits(items: list[Any]) -> list[ClinicResult]:
    out: list[ClinicResult] = []
    for it in items[:8]:
        if isinstance(it, dict):
            out.append(
                ClinicResult(
                    title=str(it.get("title") or it.get("name") or "Result"),
                    snippet=it.get("snippet") or it.get("description"),
                    url=it.get("url") or it.get("link"),
                )
            )
    return out
