import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const mockMoodData = [
  { mood: "Happy", count: 6 },
  { mood: "Neutral", count: 3 },
  { mood: "Stressed", count: 2 },
  { mood: "Tired", count: 1 },
  { mood: "Burned out", count: 1 },
];

const COLORS = ["#4ade80", "#60a5fa", "#facc15", "#c084fc", "#f87171"];

function Dashboard() {
  const [moodData, setMoodData] = useState(mockMoodData);
  const [totalCheckins, setTotalCheckins] = useState(13);
  const [avgFeelingStrength, setAvgFeelingStrength] = useState(null);
  const [avgValence, setAvgValence] = useState(null);
  const [usingMockData, setUsingMockData] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/dashboard/1")
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        const formattedData = Object.entries(data.mood_distribution).map(
          ([mood, count]) => ({
            mood,
            count,
          })
        );

        setMoodData(formattedData);
        setTotalCheckins(data.total);
        setAvgFeelingStrength(data.avg_feeling_strength);
        setAvgValence(data.avg_valence);
        setUsingMockData(false);
      })
      .catch(() => {
        console.log("Using mock data");
        setUsingMockData(true);
      });
  }, []);

  const dominantMood = moodData.reduce((max, item) =>
    item.count > max.count ? item : max
  );

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Group Dashboard</h1>

        <p className="text-gray-500 mb-8">
          Collective emotional overview based on anonymous check-ins
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl shadow-md p-6">
            <p className="text-gray-500">Total check-ins</p>
            <p className="text-4xl font-bold">{totalCheckins}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6">
            <p className="text-gray-500">Dominant mood</p>
            <p className="text-3xl font-bold">{dominantMood.mood}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6">
            <p className="text-gray-500">Avg. feeling strength</p>
            <p className="text-4xl font-bold">
              {avgFeelingStrength ?? "—"}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6">
            <p className="text-gray-500">Avg. valence</p>
            <p className="text-4xl font-bold">{avgValence ?? "—"}</p>
          </div>
        </div>

        {usingMockData && (
          <p className="text-sm text-yellow-700 bg-yellow-100 rounded-lg p-3 mb-6">
            Currently displaying mock data because the backend API is not
            available.
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Mood Distribution</h2>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={moodData}>
                <XAxis dataKey="mood" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Mood Share</h2>

            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={moodData}
                  dataKey="count"
                  nameKey="mood"
                  cx="50%"
                  cy="50%"
                  outerRadius={95}
                  label
                >
                  {moodData.map((entry, index) => (
                    <Cell
                      key={entry.mood}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">Backend connection</h2>

          <p className="text-gray-600">
            This dashboard calls GET /api/dashboard/1. If the backend is not
            available, it falls back to mock data.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;