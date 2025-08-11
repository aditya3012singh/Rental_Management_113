import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminDashboard from "./AdminDashboard";
import CustomerPortal from "./CustomerPortal";

import Chatbot from "./components/Chatbot";
import { MessageCircle, X } from "lucide-react"; 
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

function AppContent() {
  const { user, loading } = useAuth();
  const [isChatOpen, setIsChatOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  const renderPortalByRole = () => {
    if (!user) return null;
    
    switch (user.role) {
      case "ADMIN":
        return <AdminDashboard />;
      case "CUSTOMER":
        return <CustomerPortal />;
      case "END_USER":
        return <EndUserPortal />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Routes>
        <Route 
          path="/login" 
          element={user ? <Navigate to="/dashboard" /> : <Login />} 
        />
        <Route 
          path="/signup" 
          element={user ? <Navigate to="/dashboard" /> : <Signup />} 
        />
        <Route 
          path="/dashboard" 
          element={user ? renderPortalByRole() : <Navigate to="/login" />} 
        />
        <Route 
          path="/" 
          element={<Navigate to={user ? "/dashboard" : "/login"} />} 
        />
      </Routes>

      {/* Chatbot - only show when logged in */}
      {user && (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
          {isChatOpen && (
            <div
              className="bg-white shadow-2xl rounded-2xl border w-96 h-[500px] flex flex-col animate-slide-up mb-4"
              style={{
                animation: "slideUp 0.3s ease-out forwards",
              }}
            >
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
      )}

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

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;