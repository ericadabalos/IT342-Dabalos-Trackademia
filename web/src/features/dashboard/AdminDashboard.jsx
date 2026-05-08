import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { apiService } from "../../core/api/apiService";
import GlobalStyles from "../../core/styles/GlobalStyles";
import LoadingScreen from "../../core/components/LoadingScreen";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [hideRequests, setHideRequests] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalRequest, setModalRequest] = useState(null);
  const [modalMessage, setModalMessage] = useState("");
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { role } = useAuth();
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHideRequests = async () => {
      try {
          const data = await apiService.getHideRequests();
          console.log("hide-requests response:", data);
          // backend Task fields: id, title, userEmail, hideRequestedAt
          const mapped = (data || []).map((t) => ({
            id: t.id,
            taskTitle: t.title,
            studentEmail: t.userEmail,
            requestedAt: t.hideRequestedAt
          }));
          setHideRequests(mapped);
      } catch (err) {
          console.error("Error fetching hide requests:", err);
          setError(err.message || "Failed to fetch hide requests");
      } finally {
        setLoading(false);
      }
    };

    fetchHideRequests();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const approveHideRequest = (requestId) => {
    const req = hideRequests.find(r => r.id === requestId);
    setModalRequest(req);
    setModalMessage("");
    setModalOpen(true);
  };

  const submitApproval = async () => {
    if (!modalRequest) return;
    try {
      await apiService.approveHideRequest(modalRequest.id, modalMessage);
      setHideRequests((prev) => prev.filter((r) => r.id !== modalRequest.id));
      setModalOpen(false);
      setModalRequest(null);
    } catch (err) {
      console.error("Failed to approve hide request:", err);
      alert("Failed to approve request");
    }
  };

  if (loading) return <LoadingScreen />;

  if (role !== "ADMIN") return <div style={{ padding: 40 }}>Unauthorized — admin only.</div>;

  return (
    <div style={{ minHeight: "100vh", background: "#0a0e1a", fontFamily: "'DM Mono', monospace", display: "flex", flexDirection: "column" }}>
      <GlobalStyles />

      {/* HEADER */}
      <header style={{ background: "#0d1220", borderBottom: "1px solid #1a2236", padding: "20px 40px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 800, color: "#e2eaf8", letterSpacing: -0.5, margin: 0 }}>Admin Dashboard</h1>
          <p style={{ color: "#4a6080", fontSize: 12, margin: "4px 0 0 0" }}>Manage student requests and moderation</p>
        </div>
        <button onClick={handleLogout} style={{ background: "linear-gradient(135deg,#f87171,#dc2626)", border: "none", borderRadius: 8, color: "#fff", padding: "10px 20px", fontSize: 13, fontFamily: "'Inter', sans-serif", cursor: "pointer", fontWeight: 600 }}>
          Logout
        </button>
      </header>

      {/* MAIN CONTENT */}
      <main style={{ flex: 1, padding: "40px", overflowY: "auto" }}>
        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#e2eaf8", marginBottom: 24 }}>Pending Hide Requests</h2>
          
          {error ? (
            <div style={{ color: "#f87171", marginBottom: 12 }}>{error}</div>
          ) : hideRequests.length === 0 ? (
            <div style={{ background: "#0d1220", border: "1px solid #1e2a45", borderRadius: 12, padding: 40, textAlign: "center" }}>
              <div style={{ color: "#4a6080", fontSize: 14 }}>No pending hide requests</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {hideRequests.map((request) => (
                <div key={request.id} style={{ background: "#0d1220", border: "1px solid #1e2a45", borderRadius: 12, padding: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: "#c8d6f0", fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Task: {request.taskTitle}</div>
                    <div style={{ color: "#4a6080", fontSize: 12 }}>Requested by: {request.studentEmail}</div>
                    <div style={{ color: "#4a6080", fontSize: 12 }}>Requested at: {new Date(request.requestedAt).toLocaleString()}</div>
                  </div>
                  <div style={{ display: "flex", gap: 10 }}>
                    <button onClick={() => approveHideRequest(request.id)} style={{ background: "rgba(74,222,128,0.15)", border: "1px solid #4ade80", color: "#4ade80", borderRadius: 8, padding: "8px 16px", fontSize: 12, cursor: "pointer" }}>
                      Approve
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
      {modalOpen && modalRequest && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
          <div style={{ width: 560, background: '#0d1220', border: '1px solid #1e2a45', borderRadius: 12, padding: 20 }}>
            <h3 style={{ margin: 0, color: '#e2eaf8' }}>Approve hide request</h3>
            <div style={{ color: '#4a6080', marginTop: 8, marginBottom: 12 }}>Task: {modalRequest.taskTitle}</div>
            <textarea value={modalMessage} onChange={e => setModalMessage(e.target.value)} placeholder='Optional message to the user' style={{ width: '100%', minHeight: 100, background: '#071026', color: '#e2eaf8', border: '1px solid #1e2a45', padding: 10, borderRadius: 8 }} />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
              <button onClick={() => { setModalOpen(false); setModalRequest(null); }} style={{ background: 'transparent', border: '1px solid #1e2a45', color: '#4a6080', borderRadius: 8, padding: '8px 12px', cursor: 'pointer' }}>Cancel</button>
              <button onClick={submitApproval} style={{ background: 'linear-gradient(135deg,#4ade80,#22c55e)', border: 'none', color: '#041014', borderRadius: 8, padding: '8px 12px', cursor: 'pointer', fontWeight: 700 }}>Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
