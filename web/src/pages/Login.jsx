import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // Extract the success message if it exists
  const successMessage = location.state?.message;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:8085/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        login(data.data.user, data.data.accessToken);
        navigate("/dashboard");
      } else {
        setError(data.error.message);
      }
    } catch (err) {
      setError("Network error");
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Trackademia</h2>
        <p>Welcome to Your Productive Hub</p>

        {/* Display the success message in green if the user just registered */}
        {successMessage && (
          <p className="success" style={{ color: "green", marginBottom: "15px" }}>
            {successMessage}
          </p>
        )}

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>

        {error && <p className="error">{error}</p>}

        <p className="link">
          Don't have an account? 
          <span onClick={() => navigate("/register")} style={{ cursor: "pointer" }}> Sign Up</span>
        </p>
      </div>
    </div>
  );
}

export default Login;