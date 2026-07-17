import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  async function handleRegister() {
    if (!email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://127.0.0.1:8000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.detail || "Registration failed.");
        return;
      }
      localStorage.setItem("userEmail", email);
      navigate("/join");
    } catch (e) {
      setError("Could not connect to server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-sm">
        <h1 className="text-2xl font-semibold text-center mb-1">Create account</h1>
        <p className="text-gray-500 text-center text-sm mb-6">Join the Shared Emotional AI Space</p>

        <label className="text-sm text-gray-600 block mb-1">Email</label>
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded-lg px-4 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <label className="text-sm text-gray-600 block mb-1">Password</label>
        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-2 text-gray-400 hover:text-gray-600 text-sm"
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>

        <label className="text-sm text-gray-600 block mb-1">Repeat password</label>
        <div className="relative mb-4">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`w-full border rounded-lg px-4 py-2 text-sm pr-10 focus:outline-none focus:ring-2 ${
              confirmPassword && password !== confirmPassword
                ? "border-red-400 focus:ring-red-400"
                : "focus:ring-blue-400"
            }`}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-2 text-gray-400 hover:text-gray-600 text-sm"
          >
            {showConfirmPassword ? "🙈" : "👁️"}
          </button>
        </div>

        {confirmPassword && password !== confirmPassword && (
          <p className="text-red-500 text-sm mb-3">⚠ Passwords do not match.</p>
        )}

        {error && <p className="text-red-500 text-sm mb-3">⚠ {error}</p>}

        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white font-medium py-2 rounded-lg transition"
        >
          {loading ? "Creating account..." : "Register"}
        </button>

        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;