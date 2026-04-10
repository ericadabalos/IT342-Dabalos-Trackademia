import { useState } from "react";
import { useNavigate } from "react-router-dom";


function Register() {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:8086/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, firstname, lastname, role: "USER" }),
      });

      const data = await response.json();

      if (data.success) {
        // Redirect to sign-in page (/) and pass a success message in the state
        navigate("/", { state: { message: "Registration successful! Please sign in." } });
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
        <p>Create Your Account</p>

        <form onSubmit={handleRegister}>
          <div className="row">
            <input
              type="text"
              placeholder="First name"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Last name"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              required
            />
          </div>

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

          <button type="submit">Register</button>
        </form>

        {error && <p className="error">{error}</p>}

        <p className="link">
          Already have an account?
          <span onClick={() => navigate("/")} style={{ cursor: "pointer" }}> Sign In</span>
        </p>
      </div>
    </div>
  );
}

export default Register;