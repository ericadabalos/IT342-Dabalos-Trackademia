import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import HistoryPage from "./pages/HistoryPage";
import MyTasks from "./pages/MyTasks";
import Study from "./pages/Study";
import "./App.css";

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
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
