import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/Navbar";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import TaskDashboardPage from "./pages/TaskDashboardPage";
import TaskDetailPage from "./pages/TaskDetailPage";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      
      <Routes>
        <Route path="/" element={authUser ? <TaskDashboardPage /> : <Navigate to="/login" />} />
        <Route path="/tasks/:id" element={authUser ? <TaskDetailPage /> : <Navigate to="/login" />} />
        <Route path="/register" element={!authUser ? <RegisterPage /> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
      </Routes>

      <Toaster 
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          style: {
            padding: '16px 20px',
            color: '#1e293b', // slate-800
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderRadius: '1rem',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)',
            border: '1px solid rgba(255, 255, 255, 0.5)', 
            fontSize: '15px',
            fontWeight: '600',
            fontFamily: "'Inter', sans-serif"
          },
          success: {
            duration: 3500,
            iconTheme: {
              primary: '#10b981', // emerald-500
              secondary: '#ffffff',
            },
            style: {
              borderLeft: '5px solid #10b981',
            }
          },
          error: {
            duration: 4500,
            iconTheme: {
              primary: '#ef4444', // red-500
              secondary: '#ffffff',
            },
            style: {
              borderLeft: '5px solid #ef4444',
            }
          },
        }}
      />
    </div>
  );
};

export default App;
