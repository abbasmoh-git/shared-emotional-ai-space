import { useState } from "react";

function Checkin() {
  const [mood, setMood] = useState("");
  const [stress, setStress] = useState(1);
  const [note, setNote] = useState("");

  async function handleSubmit() {
  try {
    const response = await fetch("http://127.0.0.1:8000/api/checkins", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        group_id: 1,
        mood: mood,
        note: note,
      }),
    });

    const data = await response.json();
    console.log(data);

    if (response.ok) {
      alert("Check-in saved successfully!");
    } else {
      alert("Error while saving check-in: " + JSON.stringify(data));
    }
  } catch (error) {
    console.error("Backend connection error:", error);
    alert("Backend connection failed. Make sure FastAPI is running.");
  }
}

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-md">
        <h1 className="text-2xl font-semibold text-center mb-4">
          Mood Check-in
        </h1>

        <p className="text-gray-500 text-center mb-6">
          How are you feeling today?
        </p>

        <div className="flex justify-center gap-3 mb-6">
          {["😊", "😐", "😢", "😡", "😰"].map((emoji) => (
            <button
              key={emoji}
              onClick={() => setMood(emoji)}
              className={`text-3xl p-3 rounded-xl border ${
                mood === emoji ? "bg-indigo-100 border-indigo-500" : "bg-white"
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>

        <label className="block mb-2">Stress level: {stress}</label>
        <input
          type="range"
          min="1"
          max="5"
          value={stress}
          onChange={(e) => setStress(e.target.value)}
          className="w-full mb-6"
        />

        <label className="block mb-2">Optional note</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Write something..."
          className="w-full border rounded-lg p-3 mb-6"
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold"
        >
          Submit Check-in
        </button>
      </div>
    </div>
  );
}

export default Checkin;