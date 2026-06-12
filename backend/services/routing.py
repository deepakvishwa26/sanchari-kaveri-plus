import os
import httpx
from dotenv import load_dotenv

load_dotenv()


def _fallback_route(origin_lat, origin_lng, dest_lat, dest_lng):
    return {
        "geometry": [[origin_lng, origin_lat], [dest_lng, dest_lat]],
        "distance_km": 4.2,
        "duration_min": 15.0,
        "fallback": True,
    }


async def get_route_between_points(
    origin_lat: float,
    origin_lng: float,
    dest_lat: float,
    dest_lng: float,
):
    """
    Called by POST /dispatch endpoint.
    Returns: { geometry, distance_km, duration_min }
    """
    ors_key = os.environ.get("ORS_API_KEY", "")
    if not ors_key:
        print("ORS_API_KEY not set — using fallback route")
        return _fallback_route(origin_lat, origin_lng, dest_lat, dest_lng)

    url = "https://api.openrouteservice.org/v2/directions/driving-car"
    headers = {"Authorization": ors_key, "Content-Type": "application/json"}
    payload = {
        "coordinates": [[origin_lng, origin_lat], [dest_lng, dest_lat]],
        "format": "geojson",
    }

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            r = await client.post(url, json=payload, headers=headers)
            if r.status_code == 200:
                data = r.json()
                feature = data["features"][0]
                props = feature["properties"]["summary"]
                return {
                    "geometry": feature["geometry"]["coordinates"],
                    "distance_km": round(props["distance"] / 1000, 2),
                    "duration_min": round(props["duration"] / 60, 1),
                    "fallback": False,
                }
    except Exception as e:
        print(f"ORS error — {e} — using fallback")

    return _fallback_route(origin_lat, origin_lng, dest_lat, dest_lng)
