import React from "react";

export default function LoadingScreen() {
  return (
    <div style={{ minHeight: "100vh", background: "#0a0e1a", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Mono', monospace" }}>
      <div style={{ textAlign: "center" }}>
        {/* Note: I added 'display: inline-block' here so the gear spins perfectly on its center axis! */}
        <div style={{ fontSize: 48, marginBottom: 16, animation: "spin 1s linear infinite", display: "inline-block" }}>⚙</div>
        <div style={{ color: "#60a5fa", fontSize: 14, letterSpacing: 4, textTransform: "uppercase" }}>Loading Trackademia...</div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}