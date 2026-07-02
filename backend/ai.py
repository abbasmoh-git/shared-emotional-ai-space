import os
import json
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def analyze_checkin(mood: str, note: str, feeling_strength: int) -> dict:
    # If no note, build a minimal description from structured data
    text_to_analyze = note if note else f"Mood: {mood}, Feeling strength: {feeling_strength}/5"

    prompt = f"""
You are a sentiment analysis engine for an anonymous group wellbeing app.
Analyze this check-in and return ONLY a JSON object with this exact structure:

{{
  "emotion": "one word e.g. stress, joy, fatigue, frustration, calm, anxiety, excitement",
  "valence": number from -1.0 (very negative) to 1.0 (very positive),
  "intensity": number from 0.0 (very mild) to 1.0 (very intense)
}}

Context:
- Mood selected: {mood}
- Feeling strength: {feeling_strength}/5
- Note: "{text_to_analyze}"

Rules:
- Return ONLY the JSON object, no extra text, no explanations.
- Never try to identify who the user is.
- If the note is empty or unclear, base your analysis on mood and feeling strength only.
"""

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "user", "content": prompt}
            ],
            temperature=0.3  # low temperature = more consistent, predictable output
        )

        raw = response.choices[0].message.content.strip()
        result = json.loads(raw)  # convert JSON string → Python dict

        return {
            "emotion": result.get("emotion", None),
            "valence": result.get("valence", None),
            "intensity": result.get("intensity", None)
        }

    except Exception as e:
        # If AI fails, don't block the check-in — just return nulls
        print(f"AI analysis failed: {e}")
        return {
            "emotion": None,
            "valence": None,
            "intensity": None
        }