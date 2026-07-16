import { useEffect, useState } from "react";
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

const mockDashboardData = {
  total: 13,
  mood_distribution: {
    Happy: 6,
    Neutral: 3,
    Stressed: 2,
    Tired: 1,
    "Burned out": 1,
  },
  avg_feeling_strength: 3.5,
  avg_valence: 0.4,
  insights: null,
};

const COLORS = [
  "#4ade80",
  "#60a5fa",
  "#facc15",
  "#c084fc",
  "#f87171",
];

function formatMoodDistribution(distribution = {}) {
  return Object.entries(distribution).map(([mood, count]) => ({
    mood,
    count,
  }));
}

function Dashboard() {
  const [moodData, setMoodData] = useState([]);
  const [totalCheckins, setTotalCheckins] = useState(0);
  const [avgFeelingStrength, setAvgFeelingStrength] = useState(null);
  const [avgValence, setAvgValence] = useState(null);
  const [insights, setInsights] = useState(null);

  const [loading, setLoading] = useState(true);
  const [usingMockData, setUsingMockData] = useState(false);
  const [error, setError] = useState("");

  const groupId = localStorage.getItem("groupId");
  const groupName = localStorage.getItem("groupName");

  useEffect(() => {
    async function loadDashboard() {
      setLoading(true);
      setError("");
      setUsingMockData(false);

      if (!groupId) {
        setError("No group selected. Please join a group first.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/dashboard/${groupId}`
        );

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();

        /*
         * When there are no check-ins, the backend currently returns:
         * {
         *   group_id: 10,
         *   total: 0,
         *   data: []
         * }
         *
         * Therefore mood_distribution may not exist.
         */
        const distribution = data.mood_distribution ?? {};

        setMoodData(formatMoodDistribution(distribution));
        setTotalCheckins(data.total ?? 0);
        setAvgFeelingStrength(data.avg_feeling_strength ?? null);
        setAvgValence(data.avg_valence ?? null);
        setInsights(data.insights ?? null);
      } catch (fetchError) {
        console.error("Dashboard request failed:", fetchError);

        // Development fallback if the backend cannot be reached
        setMoodData(
          formatMoodDistribution(mockDashboardData.mood_distribution)
        );
        setTotalCheckins(mockDashboardData.total);
        setAvgFeelingStrength(
          mockDashboardData.avg_feeling_strength
        );
        setAvgValence(mockDashboardData.avg_valence);
        setInsights(mockDashboardData.insights);

        setUsingMockData(true);
        setError("Could not connect to the backend.");
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [groupId]);

  const dominantMood =
    moodData.length > 0
      ? moodData.reduce((currentMaximum, item) =>
          item.count > currentMaximum.count
            ? item
            : currentMaximum
        ).mood
      : "—";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-500 text-lg">
          Loading dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">
          Group Dashboard
        </h1>

        <p className="text-gray-500 mb-8">
          {groupName
            ? `${groupName} — collective emotional overview`
            : "Collective emotional overview based on anonymous check-ins"}
        </p>

        {error && !usingMockData && (
          <div className="text-red-700 bg-red-100 rounded-lg p-4 mb-6">
            {error}
          </div>
        )}

        {usingMockData && (
          <div className="text-yellow-700 bg-yellow-100 rounded-lg p-4 mb-6">
            {error} Demo data is currently being displayed.
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl shadow-md p-6">
            <p className="text-gray-500">Total check-ins</p>
            <p className="text-4xl font-bold">{totalCheckins}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6">
            <p className="text-gray-500">Dominant mood</p>
            <p className="text-3xl font-bold">{dominantMood}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6">
            <p className="text-gray-500">
              Avg. feeling strength
            </p>

            <p className="text-4xl font-bold">
              {avgFeelingStrength !== null
                ? `${avgFeelingStrength}/5`
                : "—"}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6">
            <p className="text-gray-500">Avg. valence</p>

            <p className="text-4xl font-bold">
              {avgValence !== null ? avgValence : "—"}
            </p>
          </div>
        </div>

        {insights &&
          (insights.summary ||
            insights.recommendation ||
            insights.trend) && (
            <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-3">
                Group Insights
              </h2>

              {insights.summary && (
                <p className="text-gray-700 mb-3">
                  {insights.summary}
                </p>
              )}

              {insights.recommendation && (
                <p className="text-gray-600 mb-3">
                  💡 {insights.recommendation}
                </p>
              )}

              {insights.trend && (
                <span className="inline-block text-sm px-3 py-1 rounded-full bg-gray-100 text-gray-700">
                  Trend: {insights.trend}
                </span>
              )}
            </div>
          )}

        {totalCheckins === 0 && !usingMockData ? (
          <div className="bg-white rounded-2xl shadow-md p-10 text-center">
            <h2 className="text-xl font-semibold mb-2">
              No check-ins yet
            </h2>

            <p className="text-gray-500">
              Submit the first check-in to populate this dashboard.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">
                Mood Distribution
              </h2>

              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={moodData}>
                  <XAxis dataKey="mood" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">
                Mood Share
              </h2>

              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={moodData}
                    dataKey="count"
                    nameKey="mood"
                    cx="50%"
                    cy="50%"
                    outerRadius={95}
                    label={({ mood, count }) =>
                      `${mood}: ${count}`
                    }
                  >
                    {moodData.map((entry, index) => (
                      <Cell
                        key={`${entry.mood}-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>

                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-md p-6 mt-6">
          <h2 className="text-xl font-semibold mb-3">
            Backend connection
          </h2>

          <p className="text-gray-600">
            This dashboard calls{" "}
            <code>
              GET /api/dashboard/{groupId || "{group_id}"}
            </code>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;