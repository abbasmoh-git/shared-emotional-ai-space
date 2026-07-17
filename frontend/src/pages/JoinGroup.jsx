import { useState } from "react";
import { useNavigate } from "react-router-dom";

function JoinGroup() {
  const [joinCode, setJoinCode] = useState("");
  const [groupName, setGroupName] = useState("");
  const [joinError, setJoinError] = useState("");
  const [createError, setCreateError] = useState("");
  const [createdCode, setCreatedCode] = useState(null);
  const userKey = "myGroups_" + (localStorage.getItem("userEmail") || "guest");
  const [myGroups, setMyGroups] = useState(() => {
    const saved = localStorage.getItem(userKey);
    return saved ? JSON.parse(saved) : [];
  });
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  async function handleJoin() {
    if (!joinCode.trim()) {
      setJoinError("Please enter a group code.");
      return;
    }
    setJoinError("");
    try {
      const res = await fetch("http://127.0.0.1:8000/api/groups/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: joinCode }),
      });
      const data = await res.json();
      if (!res.ok) {
        setJoinError(data.detail || "Group not found.");
        return;
      }
      setMyGroups((prev) => {
        const exists = prev.find((g) => g.code === data.group.code);
        if (exists) return prev;
        const updated = [...prev, data.group];
        localStorage.setItem(userKey, JSON.stringify(updated));
        return updated;
      });
      setJoinCode("");
      localStorage.setItem("currentGroupId", data.group.id);
      navigate("/checkin");
    } catch {
      setJoinError("Cannot connect to server.");
    }
  }

  async function handleCreate() {
    if (!groupName.trim()) {
      setCreateError("Please enter a group name.");
      return;
    }
    setCreateError("");
    const code = groupName.trim().toUpperCase().replace(/\s+/g, "-") + "-" + Math.random().toString(36).substring(2, 6).toUpperCase();
    try {
      const res = await fetch("http://127.0.0.1:8000/api/groups/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: groupName, code }),
      });
      const data = await res.json();
      if (!res.ok) {
        setCreateError(data.detail || "Could not create group.");
        return;
      }
      setCreatedCode(data.code);
      setMyGroups((prev) => {
        const updated = [...prev, data];
        localStorage.setItem(userKey, JSON.stringify(updated));
        alert("Saved under: " + userKey + " | value: " + localStorage.getItem(userKey));
        return updated;
      });
      localStorage.setItem("currentGroupId", data.id);
      setGroupName("");
    } catch {
      setCreateError("Cannot connect to server.");
    }
  }

  function copyCode() {
    navigator.clipboard.writeText(createdCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-lg mx-auto flex flex-col gap-6">

        <h1 className="text-3xl font-semibold text-center text-gray-800">Group Hub</h1>
        <p className="text-center text-gray-500 text-sm">Create a group or join one with a code</p>

        {/* Create a group */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">✨ Create a new group</h2>
          <label className="text-sm text-gray-600 block mb-1">Group name</label>
          <input
            type="text"
            placeholder="e.g. Team Alpha"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          {createError && <p className="text-red-500 text-sm mb-3">⚠ {createError}</p>}
          <button
            onClick={handleCreate}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition"
          >
            Create group
          </button>

          {createdCode && (
            <div className="mt-4 bg-indigo-50 border border-indigo-200 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600 mb-1">Share this code with your group:</p>
              <p className="text-2xl font-bold text-indigo-600 tracking-widest mb-3">{createdCode}</p>
              <button
                onClick={copyCode}
                className="text-sm bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-lg transition"
              >
                {copied ? "✓ Copied!" : "Copy code"}
              </button>
            </div>
          )}
        </div>

        {/* Join a group */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">🔗 Join a group</h2>
          <label className="text-sm text-gray-600 block mb-1">Group code</label>
          <input
            type="text"
            placeholder="e.g. TEAM-ALPHA-X7K2"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {joinError && <p className="text-red-500 text-sm mb-3">⚠ {joinError}</p>}
          <button
            onClick={handleJoin}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-lg transition"
          >
            Join group
          </button>
        </div>

        {/* My groups */}
                <div className="bg-white rounded-2xl shadow-md p-6">
                  <h2 className="text-lg font-semibold mb-4">👥 My groups</h2>
                  {myGroups.length === 0 ? (
                    <p className="text-gray-400 text-sm text-center py-4">
                      You haven't joined any groups yet. Create one or enter a code above.
                    </p>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {myGroups.map((group) => (
                        <div
                          key={group.code}
                          className="flex items-center justify-between border rounded-lg px-4 py-3"
                        >
                          <div>
                            <p className="font-medium text-gray-800">{group.name}</p>
                            <p className="text-xs text-gray-400">{group.code}</p>
                          </div>
                          <button
                            onClick={() => {
                              localStorage.setItem("currentGroupId", group.id);
                              navigate("/checkin");
                            }}
                            className="text-sm bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg transition"
                          >
                            Check in →
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            </div>
          );
        }

export default JoinGroup;