import { useState, useEffect } from "react"; 
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { SUBJECT_COLORS, LOG_ICONS } from "./constants";
import Sidebar from "./Sidebar"; 
import { apiService } from "../services/apiService";
import LoadingScreen from "./LoadingScreen";
import GlobalStyles from "./GlobalStyles";

export default function HistoryPage() {
  const [tasks, setTasks] = useState([]);
  const [activities, setActivities] = useState([]);
  
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tasksData = await apiService.getCompletedTasks();
        setTasks(tasksData);
        
        const activitiesData = await apiService.getActivities();
        setActivities(activitiesData);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Group activities by date
  const groupActivitiesByDate = (activities) => {
    const grouped = {};
    
    activities.forEach(activity => {
      const date = new Date(activity.timestamp);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      let dateLabel;
      if (date.toDateString() === today.toDateString()) {
        dateLabel = "Today";
      } else if (date.toDateString() === yesterday.toDateString()) {
        dateLabel = "Yesterday";
      } else {
        dateLabel = date.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
      }
      
      if (!grouped[dateLabel]) grouped[dateLabel] = [];
      grouped[dateLabel].push(activity);
    });
    
    return grouped;
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  };

  const byDate = groupActivitiesByDate(activities);
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
      <main style={{ marginLeft: 220, flex: 1, padding: "32px 40px", overflowY: "hidden", height: "100vh" }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: 28, fontWeight: 800, color: "#e2eaf8", letterSpacing: -0.5 }}>History</h1>
          <div style={{ color: "#4a6080", fontSize: 13, marginTop: 4 }}>Full log of your activity and completed tasks</div>
        </div>

        <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
          
          {/* Completed tasks List */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: "#e2eaf8" }}>Completed Tasks</h2>
              <span style={{ background: "rgba(74,222,128,0.1)", color: "#4ade80", fontSize: 10, padding: "2px 8px", borderRadius: 10 }}>{tasks.length}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {tasks.length === 0 ? (
                <div style={{ color: "#4a6080", fontSize: 13, padding: "20px", textAlign: "center" }}>No completed tasks yet</div>
              ) : (
                tasks.map(task => {
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
                          <div style={{ color: "#4a6080", fontSize: 11 }}>Deadline: {new Date(task.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Activity timeline */}
          <div style={{ width: 310, flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: "#e2eaf8" }}>Activity Log</h2>
            </div>
            <div style={{ maxHeight: "calc(100vh - 230px)", overflowY: "auto", paddingRight: 4, paddingBottom: 12 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {Object.entries(byDate).map(([date, entries]) => (
                  <div key={date}>
                    <div style={{ position: "sticky", top: 0, zIndex: 2, background: "#0a0e1a", padding: "8px 0" }}>
                      <div style={{ color: "#4a6080", fontSize: 11, letterSpacing: 1, textTransform: "uppercase", marginBottom: 12, fontWeight: 600 }}>{date}</div>
                    </div>
                    <div style={{ position: "relative" }}>
                      {entries.map((activity, i) => (
                        <div key={activity.id} className="fade-in" style={{ display: "flex", gap: 12, alignItems: "flex-start", position: "relative", paddingLeft: 26, paddingBottom: i < entries.length - 1 ? 16 : 0 }}>
                          {i < entries.length - 1 && <div style={{ position: "absolute", left: 9, top: 20, width: 2, bottom: 0, background: "#1e2a45" }} />}
                          <div style={{ position: "absolute", left: 4, top: 6, width: 12, height: 12, borderRadius: "50%", background: dotColor[activity.type] || "#4a6080", border: "2px solid #0a0e1a", flexShrink: 0 }} />
                          <div style={{ background: "#0d1220", border: "1px solid #1e2a45", borderRadius: 8, padding: "10px 14px", flex: 1 }}>
                            <div style={{ color: "#8da4c8", fontSize: 12, lineHeight: 1.5, fontWeight: 500 }}>{activity.text}</div>
                            <div style={{ color: "#4a6080", fontSize: 11, marginTop: 4 }}>{formatTime(activity.timestamp)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}