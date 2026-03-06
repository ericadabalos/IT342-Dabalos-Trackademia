import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:8084/api/auth/login", {
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
          <button type="submit">Sign In</button>
        </form>

        {error && <p className="error">{error}</p>}

        <p className="link">
          Don't have an account? 
          <span onClick={() => navigate("/register")}> Sign Up</span>
        </p>
      </div>
    </div>
  );
}

export default Login;
