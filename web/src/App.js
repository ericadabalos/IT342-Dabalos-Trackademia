import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./features/auth/AuthContext";
import Login from "./features/auth/Login";
import Register from "./features/auth/Register";
import Dashboard from "./features/dashboard/Dashboard";
import HistoryPage from "./features/activity/HistoryPage";
import MyTasks from "./features/tasks/MyTasks";
import Study from "./features/study/Study";
import AdminDashboard from "./features/dashboard/AdminDashboard";
import ProtectedRoute from "./core/components/ProtectedRoute";
import "./core/styles/App.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/tasks" element={<MyTasks />} />
          <Route path="/study" element={<Study />} />
          <Route path="/admin-dashboard" element={<ProtectedRoute requiredRole="ADMIN"><AdminDashboard /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
