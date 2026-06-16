import { useState } from "react";

function JoinGroup() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [joined, setJoined] = useState(false);

  function handleJoin() {
    if (!code.trim()) {
      setError("Please enter a group code.");
      return;
    }
    setError("");
    setJoined(true);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-sm">

        <h1 className="text-2xl font-semibold text-center mb-2">Join a Group</h1>
        <p className="text-gray-500 text-center text-sm mb-6">
          Enter your group code to get started
        </p>

        <label className="text-sm text-gray-600 block mb-1">Group code</label>
        <input
          type="text"
          placeholder="e.g. TEAM-2024"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full border rounded-lg px-4 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {error && (
          <p className="text-red-500 text-sm mb-3">⚠ {error}</p>
        )}

        {joined && (
          <p className="text-green-500 text-sm mb-3">✓ Successfully joined!</p>
        )}

        <button
          onClick={handleJoin}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-lg transition"
        >
          Join Group
        </button>

      </div>
    </div>
  );
}

export default JoinGroup;