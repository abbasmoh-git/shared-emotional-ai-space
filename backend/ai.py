import os
import json
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=api_key) if api_key else None

def analyze_checkin(mood: str, note: str, feeling_strength: int) -> dict:
    # If no note, build a minimal description from structured data
    text_to_analyze = note if note else f"Mood: {mood}, Feeling strength: {feeling_strength}/5"

    prompt = f"""
You are an emotional analysis assistant for a group wellbeing platform called "Shared Emotional AI Space". Analyze a short anonymous mood check-in from a team member.

The user selected a mood, a feeling strength from 1 (very mild) to 5 (very strong), and optionally wrote a note. Based on these, return ONLY a valid JSON object with exactly these fields:

- "emotion": one of ["happy","neutral","stressed","tired","burned_out"]
- "valence": float from -1.0 (very negative) to 1.0 (very positive)
- "intensity": float from 0.0 (very mild) to 1.0 (very strong)

Rules:
- Return ONLY the JSON object. No explanation, no markdown.
- If a note is provided, base your analysis primarily on the note.
- If the note is empty, use the feeling strength to estimate intensity.
- Keep the emotion consistent with the user's selected mood unless the note strongly suggests otherwise.
- Intensity = how strongly the feeling is expressed, not how positive or negative.

Selected mood: "{mood}"
Feeling strength: "{feeling_strength}"
Note: "{note}"
"""

    try:
        if not client:
            raise Exception("No API key")
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "user", "content": prompt}
            ],
            temperature=0.3
        )
        raw = response.choices[0].message.content.strip()
        result = json.loads(raw)
        return {
            "emotion": result.get("emotion", None),
            "valence": result.get("valence", None),
            "intensity": result.get("intensity", None)
        }
    except Exception as e:
        print(f"AI analysis failed: {e}")
        return {
            "emotion": None,
            "valence": None,
            "intensity": None
        }
    

def generate_group_insights(count: int, emotions: dict, avg_valence: float, avg_intensity: float, change: str = "not enough data") -> dict:
    prompt = f"""
You are an insights assistant for a group wellbeing platform called "Shared Emotional AI Space". You receive aggregated, anonymous emotional data from a group's mood check-ins over a period of time.

Your task is to generate a short, supportive insight about the group's collective emotional state. Never mention or identify individuals — only describe the group as a whole.

Return ONLY a valid JSON object with exactly these fields:
- "summary": one sentence describing the group's current emotional state
- "recommendation": one short, gentle suggestion for the group
- "trend": one of ["improving","stable","declining"]

Rules:
- Return ONLY the JSON object. No explanation, no markdown.
- Keep the tone warm, supportive, and non-judgmental.
- Never single out or imply any individual.
- Base everything only on the aggregated data provided.

Group data:
- Number of check-ins: {count}
- Emotion distribution: {emotions}
- Average valence: {avg_valence}
- Average intensity: {avg_intensity}
- Compared to last period: {change}
"""

    try:
        if not client:
            raise Exception("No API key")
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3
        )
        raw = response.choices[0].message.content.strip()
        result = json.loads(raw)
        return {
            "summary": result.get("summary", None),
            "recommendation": result.get("recommendation", None),
            "trend": result.get("trend", None)
        }
    except Exception as e:
        print(f"Group insights generation failed: {e}")
        return {
            "summary": None,
            "recommendation": None,
            "trend": None
        }