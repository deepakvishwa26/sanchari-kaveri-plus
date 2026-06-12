import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

FALLBACK = (
    "RECOMMENDATION: T-02 | REASON: Highest trust score (0.85). "
    "Closest to Whitefield Connect Centre. | PRIORITY: HIGH"
)

_configured = False


def _setup():
    global _configured
    if not _configured:
        api_key = os.environ.get("GEMINI_API_KEY", "")
        if api_key:
            genai.configure(api_key=api_key)
        _configured = True


def get_dispatch_recommendation(
    ward_name: str,
    dwpi_score: float,
    pending_count: int,
    tankers: list,
) -> str:
    """
    Called by POST /dispatch endpoint.
    tankers: list of Tanker ORM objects with .id and .trust_score
    Returns a formatted string like:
      RECOMMENDATION: T-02 | REASON: ... | PRIORITY: HIGH
    """
    try:
        _setup()
        model = genai.GenerativeModel("gemini-2.0-flash")
        tanker_list = ", ".join(
            [f"{t.id}(trust:{t.trust_score:.2f})" for t in tankers]
        )
        prompt = f"""You are a BWSSB AI assistant.
Ward {ward_name} has DWPI score {dwpi_score:.2f}.
Pending requests: {pending_count}. Available tankers: {tanker_list}.
Respond exactly: RECOMMENDATION: [id] | REASON: [2 sentences] | PRIORITY: HIGH/MEDIUM/LOW"""

        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        print(f"Gemini fallback used — {e}")
        return FALLBACK
