import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const isLoggedIn = !!localStorage.getItem("token");

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("currentGroupId");
    navigate("/login");
  }

  return (
    <>
      <nav className="w-full bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">
          Shared Emotional AI Space
        </h1>
        {isLoggedIn && (
          <button
            onClick={() => setShowModal(true)}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg transition text-sm"
          >
            Log out
          </button>
        )}
      </nav>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{backdropFilter: "blur(2px)"}}>
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm text-center">
            <div className="text-4xl mb-4">👋</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Logging out?</h2>
            <p className="text-gray-500 text-sm mb-6">
              Are you sure you want to log out of your account?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  handleLogout();
                }}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition font-medium"
              >
                Yes, log out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;