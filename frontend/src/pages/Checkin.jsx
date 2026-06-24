import { useState } from "react";

const moods = [
  { label: "Happy", icon: "😊" },
  { label: "Neutral", icon: "😐" },
  { label: "Stressed", icon: "😣" },
  { label: "Tired", icon: "😴" },
  { label: "Burned out", icon: "🔥" },
];

function Checkin() {
  const [mood, setMood] = useState(null);
  const [stress, setStress] = useState(3);
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit() {
    const checkinData = { mood, stress, note };
    console.log("Check-in submitted:", checkinData);
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-sm">

        <h1 className="text-2xl font-semibold text-center mb-1">How are you feeling?</h1>
        <p className="text-gray-500 text-center text-sm mb-6">Your check-in is anonymous</p>

        <p className="text-sm text-gray-600 mb-2">Mood</p>
        <div className="grid grid-cols-5 gap-2 mb-6">
          {moods.map((m) => (
            <button
              key={m.label}
              onClick={() => setMood(m.label)}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg border text-xs ${
                mood === m.label ? "border-blue-500 bg-blue-50" : "border-gray-200"
              }`}
            >
              <span className="text-xl">{m.icon}</span>
              {m.label}
            </button>
          ))}
        </div>

        <p className="text-sm text-gray-600 mb-2">
          Stress level: <span className="font-medium">{stress}</span>/5
        </p>
        <input
          type="range"
          min="1"
          max="5"
          step="1"
          value={stress}
          onChange={(e) => setStress(Number(e.target.value))}
          className="w-full mb-6"
        />

        <p className="text-sm text-gray-600 mb-2">Note (optional)</p>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Anything you want to add..."
          className="w-full border rounded-lg p-2 text-sm mb-6 resize-none"
          rows={3}
        />

        <button
          onClick={handleSubmit}
          disabled={!mood}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white font-medium py-2 rounded-lg transition"
        >
          Submit Check-in
        </button>

        {submitted && (
          <p className="text-green-500 text-sm text-center mt-3">✓ Check-in submitted!</p>
        )}
      </div>
    </div>
  );
}

export default Checkin;