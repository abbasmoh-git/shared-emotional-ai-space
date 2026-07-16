import { useState } from "react";
import { useNavigate } from "react-router-dom";

function JoinGroup() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [joined, setJoined] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleJoin() {
    if (!code.trim()) {
      setError("Please enter a group code.");
      return;
    }

    setError("");
    setJoined(false);
    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/groups/join",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code: code.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.detail || "Group not found.");
        return;
      }

      // Save the joined group information for Check-in and Dashboard
      localStorage.setItem("groupId", String(data.group.id));
      localStorage.setItem("groupCode", data.group.code);
      localStorage.setItem("groupName", data.group.name);

      setJoined(true);

      setTimeout(() => {
        navigate("/checkin");
      }, 800);
    } catch (error) {
      console.error("Join group error:", error);
      setError("Cannot connect to server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-sm">
        <h1 className="text-2xl font-semibold text-center mb-2">
          Join a Group
        </h1>

        <p className="text-gray-500 text-center text-sm mb-6">
          Enter your group code to get started
        </p>

        <label className="text-sm text-gray-600 block mb-1">
          Group code
        </label>

        <input
          type="text"
          placeholder="e.g. TEAM2026"
          value={code}
          onChange={(event) => setCode(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              handleJoin();
            }
          }}
          className="w-full border rounded-lg px-4 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {error && (
          <p className="text-red-500 text-sm mb-3">⚠ {error}</p>
        )}

        {joined && (
          <p className="text-green-500 text-sm mb-3">
            ✓ Successfully joined!
          </p>
        )}

        <button
          onClick={handleJoin}
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-medium py-2 rounded-lg transition"
        >
          {loading ? "Joining..." : "Join Group"}
        </button>
      </div>
    </div>
  );
}

export default JoinGroup;