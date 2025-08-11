import React, { useState } from "react";
import AdminDashboard from "./AdminDashboard";
import CustomerPortal from "./CustomerPortal";
import EndUserPortal from "./EndUserPortal";
import Chatbot from "./components/Chatbot";
import { MessageCircle, X } from "lucide-react"; 
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function App() {
  const [currentPortal, setCurrentPortal] = useState<
    "admin" | "customer" | "enduser"
  >("admin");
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleLogout = () => {
    console.log("Logout clicked");
    setCurrentPortal("admin");
  };

  const renderPortal = () => {
    switch (currentPortal) {
      case "admin":
        return <AdminDashboard onLogout={handleLogout} />;
      case "customer":
        return <CustomerPortal onLogout={handleLogout} />;
      case "enduser":
        return <EndUserPortal onLogout={handleLogout} />;
      default:
        return <AdminDashboard onLogout={handleLogout} />;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Portal Switcher */}
      <div className="fixed top-4 right-4 z-50 bg-white rounded-lg shadow-lg p-2 border">
        <select
          value={currentPortal}
          onChange={(e) =>
            setCurrentPortal(e.target.value as "admin" | "customer" | "enduser")
          }
          className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-400"
        >
          <option value="admin">Admin Portal</option>
          <option value="customer">Customer Portal</option>
          <option value="enduser">End User Portal</option>
        </select>
      </div>

      {renderPortal()}

      <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
        {isChatOpen && (
          <div
            className="bg-white shadow-2xl rounded-2xl border w-96 h-[500px] flex flex-col animate-slide-up"
            style={{
              animation: "slideUp 0.3s ease-out forwards",
            }}
          >
            {/* Chatbot Header */}
            <div className="bg-green-600 text-white px-4 py-3 rounded-t-2xl flex justify-between items-center shadow-md">
              <h3 className="font-semibold text-lg">SewaSaathi 🤝</h3>
              <button
                onClick={() => setIsChatOpen(false)}
                className="text-white hover:bg-green-700 p-1 rounded-full transition"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-hidden">
              <Chatbot />
            </div>
          </div>
        )}

        {!isChatOpen && (
          <button
            onClick={() => setIsChatOpen(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-full shadow-lg flex items-center space-x-2 transition-all duration-200 hover:scale-105"
          >
            <MessageCircle size={20} />
            <span className="font-medium">Chat with SewaSaathi</span>
          </button>
        )}
      </div>

      {/* Animations */}
      <style>
        {`
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
}

export default App;