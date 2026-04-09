import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Sidebar({ activePage, handleLogout }) {
  const navigate = useNavigate();
  const [user, setUser] = useState({ firstname: "Student", lastname: "" });

  //fetch the user data from localStorage when the sidebar loads
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse user data", error);
      }
    }
  }, []);

  //get the first letter of their firstname for the circle avatar
  const initial = user.firstname ? user.firstname.charAt(0).toUpperCase() : "S";

  return (
    <aside style={{ width: 220, background: "#0a0e1a", borderRight: "1px solid #1a2236", display: "flex", flexDirection: "column", padding: "24px 0", position: "fixed", height: "100vh", zIndex: 10 }}>
      <div style={{ padding: "0 20px 24px", borderBottom: "1px solid #1a2236" }}>
        <div style={{ fontSize: 11, letterSpacing: 3, color: "#4a6080", fontWeight: 600, marginBottom: 16, textTransform: "uppercase" }}>Trackademia</div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg,#60a5fa,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0, color: "#fff", fontWeight: 600 }}>
            {initial}
          </div>
          <div>
            {/*dynamically display the firstname and lastname*/}
            <div style={{ color: "#e2eaf8", fontSize: 13, fontWeight: 700 }}>{user.firstname} {user.lastname}</div>
            <div style={{ color: "#4a6080", fontSize: 11 }}>BSCS — 2nd Year</div>
          </div>
        </div>
      </div>

      <nav style={{ padding: "16px 12px", flex: 1 }}>
        {/*Home Button*/}
        <button 
          onClick={() => navigate("/dashboard")} 
          style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 8, color: activePage === "home" ? "#60a5fa" : "#4a6080", background: activePage === "home" ? "#1a233a" : "none", border: "none", borderLeft: activePage === "home" ? "3px solid #60a5fa" : "3px solid transparent", fontSize: 14, marginBottom: 4, textAlign: "left", cursor: "pointer", fontWeight: activePage === "home" ? 600 : 400 }}
        >
          <span style={{ fontSize: 16 }}>🏠</span> Home
        </button>

        {/*History Button*/}
        <button 
          onClick={() => navigate("/history")} 
          style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 8, color: activePage === "history" ? "#60a5fa" : "#4a6080", background: activePage === "history" ? "#1a233a" : "none", border: "none", borderLeft: activePage === "history" ? "3px solid #60a5fa" : "3px solid transparent", fontSize: 14, marginBottom: 4, textAlign: "left", cursor: "pointer", fontWeight: activePage === "history" ? 600 : 400 }}
        >
          <span style={{ fontSize: 16 }}>🕓</span> History
        </button>
      </nav>

      <div style={{ padding: "16px 12px", borderTop: "1px solid #1a2236" }}>
        <button onClick={handleLogout} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 8, color: "#f87171", background: "none", border: "none", cursor: "pointer", fontSize: 14, fontWeight: 500 }}>
          <span>⏻</span> Logout
        </button>
      </div>
    </aside>
  );
}