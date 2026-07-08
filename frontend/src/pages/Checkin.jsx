import { useState } from "react";

const moods = [
  { label: "Happy", icon: "😊" },
  { label: "Neutral", icon: "😐" },
  { label: "Stressed", icon: "😰" },
  { label: "Tired", icon: "😴" },
  { label: "Burned out", icon: "🔥" },
];

function Checkin() {
  const [mood, setMood] = useState(null);
  const [feelingStrength, setFeelingStrength] = useState(3);
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    if (!mood) {
      setError("Please select a mood first.");
      return;
    }

    setError("");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/checkins", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          group_id: 1,
          mood: mood.label,
          feeling_strength: Number(feelingStrength),
          note: note || null,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitted(true);
        setMood(null);
        setFeelingStrength(3);
        setNote("");
        setTimeout(() => setSubmitted(false), 3000);
      } else {
        setError("Error: " + JSON.stringify(data));
      }
    } catch {
      setError("Backend connection failed. Make sure FastAPI is running.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-md">

        <h1 className="text-2xl font-semibold text-center mb-2">
          Mood Check-in
        </h1>
        <p className="text-gray-400 text-center text-sm mb-8">
          How are you feeling today? Your response is anonymous.
        </p>

        {/* Mood selector */}
        <div className="flex justify-center gap-3 mb-8">
          {moods.map((m) => (
            <button
              key={m.label}
              onClick={() => setMood(m)}
              title={m.label}
              className={`text-3xl p-3 rounded-xl border-2 transition-all ${
                mood?.label === m.label
                  ? "bg-indigo-50 border-indigo-400 scale-110"
                  : "bg-white border-gray-200 hover:border-indigo-200"
              }`}
            >
              {m.icon}
            </button>
          ))}
        </div>
        {mood && (
          <p className="text-center text-sm text-indigo-500 font-medium -mt-5 mb-6">
            {mood.label}
          </p>
        )}

        {/* Feeling strength slider */}
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Feeling strength (how strong you feel this):{" "}
          <span className="text-indigo-500 font-bold">{feelingStrength}/5</span>
        </label>
        <input
          type="range"
          min="1"
          max="5"
          value={feelingStrength}
          onChange={(e) => setFeelingStrength(e.target.value)}
          className="w-full accent-indigo-500 mb-8"
        />

        {/* Note */}
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Optional note
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="A short note helps us understand your mood better 💬"
          className="w-full border border-gray-200 rounded-lg p-3 mb-6 text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-indigo-300"
        />

        {error && (
          <p className="text-red-500 text-sm mb-4">⚠ {error}</p>
        )}
        {submitted && (
          <p className="text-green-500 text-sm mb-4">✓ Check-in saved!</p>
        )}

        <button
          onClick={handleSubmit}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition-colors"
        >
          Submit Check-in
        </button>

      </div>
    </div>
  );
}

export default Checkin;
