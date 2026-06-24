import { useEffect, useState } from "react";

const moodColors = {
  Happy: "#4ade80",
  Neutral: "#60a5fa",
  Stressed: "#facc15",
  Tired: "#c084fc",
  "Burned out": "#f87171",
};

const moodIcons = {
  Happy: "😊",
  Neutral: "😐",
  Stressed: "😰",
  Tired: "😴",
  "Burned out": "🔥",
};

function getMoodCounts(checkins) {
  const counts = {};
  checkins.forEach(({ mood }) => {
    counts[mood] = (counts[mood] || 0) + 1;
  });
  return counts;
}

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function Dashboard() {
  const [checkins, setCheckins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/checkins")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => {
        setCheckins(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Could not load check-ins. Is the backend running?");
        setLoading(false);
      });
  }, []);

  const moodCounts = getMoodCounts(checkins);
  const total = checkins.length;
  const dominant = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">

        <h1 className="text-2xl font-semibold mb-1">Group Dashboard</h1>
        <p className="text-gray-500 text-sm mb-8">
          Collective emotional climate — all data is anonymous
        </p>

        {loading && (
          <p className="text-gray-400 text-sm">Loading check-ins...</p>
        )}

        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        {!loading && !error && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-white rounded-xl shadow-sm p-5">
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Total Check-ins</p>
                <p className="text-3xl font-bold">{total}</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-5">
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Dominant Mood</p>
                <p className="text-3xl font-bold">
                  {dominant ? `${moodIcons[dominant[0]] || "❓"} ${dominant[0]}` : "—"}
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-5">
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Moods Tracked</p>
                <p className="text-3xl font-bold">{Object.keys(moodCounts).length}</p>
              </div>
            </div>

            {/* Mood breakdown */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h2 className="text-sm font-semibold text-gray-600 mb-4">Mood Breakdown</h2>
              {Object.keys(moodCounts).length === 0 ? (
                <p className="text-gray-400 text-sm">No check-ins yet.</p>
              ) : (
                <div className="space-y-3">
                  {Object.entries(moodCounts)
                    .sort((a, b) => b[1] - a[1])
                    .map(([mood, count]) => (
                      <div key={mood} className="flex items-center gap-3">
                        <span className="text-lg">{moodIcons[mood] || "❓"}</span>
                        <span className="text-sm w-24 text-gray-700">{mood}</span>
                        <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${Math.round((count / total) * 100)}%`,
                              backgroundColor: moodColors[mood] || "#94a3b8",
                            }}
                          />
                        </div>
                        <span className="text-sm text-gray-400 w-8 text-right">
                          {Math.round((count / total) * 100)}%
                        </span>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Recent check-ins */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-sm font-semibold text-gray-600 mb-4">Recent Check-ins</h2>
              {checkins.length === 0 ? (
                <p className="text-gray-400 text-sm">No check-ins yet.</p>
              ) : (
                <div className="space-y-2">
                  {checkins.slice(0, 10).map((c) => (
                    <div
                      key={c.id}
                      className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-3"
                    >
                      <span className="text-xl">{moodIcons[c.mood] || "❓"}</span>
                      <span className="text-sm font-medium flex-1">{c.mood}</span>
                      {c.stress_level && (
                        <span className="text-xs text-gray-400">
                          Stress: {c.stress_level}/5
                        </span>
                      )}
                      <span className="text-xs text-gray-400">{timeAgo(c.created_at)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
