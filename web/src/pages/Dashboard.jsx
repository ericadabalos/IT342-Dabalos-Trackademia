import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="dashboard">
      <div className="navbar">
        <h2>Trackademia Dashboard</h2>
        <div>
          <span>Welcome, {user ? user.firstname : "User"}!</span>
          <button className="logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="dashboard-cards">
        <div className="box">
          <h3>Tasks</h3>
          <p>12 Active</p>
        </div>

        <div className="box">
          <h3>Completed</h3>
          <p>5 Tasks</p>
        </div>

        <div className="box">
          <h3>Pending</h3>
          <p>7 Tasks</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
