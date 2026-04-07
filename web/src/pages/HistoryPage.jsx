import { useState, useEffect } from "react"; 
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { SUBJECT_COLORS, LOG_ICONS } from "./constants";
import Sidebar from "./Sidebar"; 

import LoadingScreen from "./LoadingScreen";
import GlobalStyles from "./GlobalStyles";

const INITIAL_TASKS = [
  { id: 5, title: "Physics Lab Report", description: "Write up the pendulum experiment results", deadline: "2026-03-18", status: "done", subject: "Physics", priority: "medium", completedAt: "Mar 18, 2026 11:30 PM" },
];

const INITIAL_LOGS = [
  { id: 1, text: "Logged into Trackademia", time: "8:02 AM", date: "Today", type: "auth" },
  { id: 2, text: "Physics Lab Report marked as done", time: "11:30 PM", date: "Yesterday", type: "complete" },
];

export default function HistoryPage() {
  const [tasks] = useState(INITIAL_TASKS);
  const [logs] = useState(INITIAL_LOGS);
  
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => { setTimeout(() => setLoading(false), 1200); }, []);

  const completedTasks = tasks.filter(t => t.status === "done");
  const byDate = logs.reduce((acc, log) => {
    if (!acc[log.date]) acc[log.date] = [];
    acc[log.date].push(log);
    return acc;
  }, {});

  const dotColor = { complete: "#4ade80", add: "#60a5fa", auth: "#3d5278", delete: "#f87171" };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (loading) return <LoadingScreen />;

  return (
    <div style={{ minHeight: "100vh", background: "#0a0e1a", fontFamily: "'Inter', sans-serif", display: "flex", overflow: "hidden" }}>
      
    
      <GlobalStyles />

      {/* SIDEBAR */}
      <Sidebar activePage="history" handleLogout={handleLogout} />

      {/* MAIN CONTENT */}
      <main style={{ marginLeft: 220, flex: 1, padding: "32px 40px", overflowY: "auto", height: "100vh" }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: 28, fontWeight: 800, color: "#e2eaf8", letterSpacing: -0.5 }}>History</h1>
          <div style={{ color: "#4a6080", fontSize: 13, marginTop: 4 }}>Full log of your activity and completed tasks</div>
        </div>

        <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
          
          {/* Completed tasks List */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: "#e2eaf8" }}>Completed Tasks</h2>
              <span style={{ background: "rgba(74,222,128,0.1)", color: "#4ade80", fontSize: 10, padding: "2px 8px", borderRadius: 10 }}>{completedTasks.length}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {completedTasks.map(task => {
                const subColor = SUBJECT_COLORS[task.subject] || SUBJECT_COLORS.default;
                return (
                  <div key={task.id} className="fade-in" style={{ background: "#0d1220", border: "1px solid #1e2a45", borderLeft: "3px solid #2d3f5a", borderRadius: 12, padding: "14px 16px" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                      <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, flexShrink: 0, marginTop: 2 }}>✅</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                          <span style={{ background: `${subColor}15`, color: subColor, fontSize: 10, padding: "3px 8px", borderRadius: 10, fontWeight: 600 }}>{task.subject}</span>
                        </div>
                        <div style={{ color: "#8da4c8", fontSize: 14, fontWeight: 600, textDecoration: "line-through", marginBottom: 3 }}>{task.title}</div>
                        <div style={{ color: "#4a6080", fontSize: 11 }}>{task.completedAt ? `Completed ${task.completedAt}` : "Completed"}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Activity timeline */}
          <div style={{ width: 310, flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: "#e2eaf8" }}>Activity Log</h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {Object.entries(byDate).map(([date, entries]) => (
                <div key={date}>
                  <div style={{ color: "#4a6080", fontSize: 11, letterSpacing: 1, textTransform: "uppercase", marginBottom: 12, fontWeight: 600 }}>{date}</div>
                  <div style={{ position: "relative" }}>
                    {entries.map((log, i) => (
                      <div key={log.id} className="fade-in" style={{ display: "flex", gap: 12, alignItems: "flex-start", position: "relative", paddingLeft: 26, paddingBottom: i < entries.length - 1 ? 16 : 0 }}>
                        {i < entries.length - 1 && <div style={{ position: "absolute", left: 9, top: 20, width: 2, bottom: 0, background: "#1e2a45" }} />}
                        <div style={{ position: "absolute", left: 4, top: 6, width: 12, height: 12, borderRadius: "50%", background: dotColor[log.type] || "#4a6080", border: "2px solid #0a0e1a", flexShrink: 0 }} />
                        <div style={{ background: "#0d1220", border: "1px solid #1e2a45", borderRadius: 8, padding: "10px 14px", flex: 1 }}>
                          <div style={{ color: "#8da4c8", fontSize: 12, lineHeight: 1.5, fontWeight: 500 }}>{log.text}</div>
                          <div style={{ color: "#4a6080", fontSize: 11, marginTop: 4 }}>{log.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}