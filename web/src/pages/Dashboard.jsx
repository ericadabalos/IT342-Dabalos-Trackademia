import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import Sidebar from "./Sidebar";
import TaskCard from "./TaskCard"; 
import { formatDeadline, LOG_ICONS, SUBJECT_COLORS, PRIORITY_STYLES } from "./constants"; 
import LoadingScreen from "./LoadingScreen";
import GlobalStyles from "./GlobalStyles";

const INITIAL_TASKS = [
  { id: 1, title: "Database Systems Assignment", description: "Complete ER diagram and normalization up to 3NF", deadline: "2026-03-22", status: "pending", subject: "DBMS", priority: "high" },
  { id: 2, title: "Calculus Problem Set #4", description: "Solve integration problems chapters 7-9", deadline: "2026-03-24", status: "pending", subject: "Math", priority: "medium" },
  { id: 3, title: "OOP Lab Report", description: "Document the inheritance and polymorphism exercise", deadline: "2026-03-21", status: "pending", subject: "CS", priority: "high" },
  { id: 4, title: "English Essay Draft", description: "Write 1500-word argumentative essay on digital ethics", deadline: "2026-03-28", status: "pending", subject: "English", priority: "low" },
];

const INITIAL_LOGS = [
  { id: 1, text: "Logged into Trackademia", time: "8:02 AM", type: "auth" },
  { id: 2, text: "Physics Lab Report marked as done", time: "Yesterday 11:30 PM", type: "complete" },
  { id: 3, text: "Joined Study Group: CS 201", time: "Yesterday 3:15 PM", type: "group" },
  { id: 4, text: "Uploaded: midterm_notes.pdf to CS 201", time: "Yesterday 3:20 PM", type: "upload" },
];

function now12() {
  return new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

export default function Dashboard() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [logs, setLogs] = useState(INITIAL_LOGS);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [completingId, setCompletingId] = useState(null);
  const [newTask, setNewTask] = useState({ title: "", description: "", deadline: "", subject: "CS", priority: "medium" });
  
  const logRef = useRef(null);
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => { setTimeout(() => setLoading(false), 1200); }, []);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = 0;
  }, [logs]);

  const pendingTasks = tasks.filter(t => t.status === "pending");
  const completedCount = tasks.filter(t => t.status === "done").length;

  function handleComplete(id) {
    setCompletingId(id);
    setTimeout(() => {
      const task = tasks.find(t => t.id === id);
      setTasks(prev => prev.map(t => t.id === id ? { ...t, status: "done", completedAt: now12() } : t));
      setLogs(prev => [{ id: Date.now(), text: `${task.title} marked as done`, time: now12(), type: "complete" }, ...prev]);
      setCompletingId(null);
    }, 600);
  }
  
  function handleDelete(id) {
    const task = tasks.find(t => t.id === id);
    setTasks(prev => prev.filter(t => t.id !== id));
    setLogs(prev => [{ id: Date.now(), text: `Deleted: ${task.title}`, time: now12(), date: "Today", type: "delete" }, ...prev]);
  }

  function handleAddTask(e) {
    e.preventDefault();
    if (!newTask.title || !newTask.deadline) return;
    const task = { id: Date.now(), ...newTask, status: "pending" };
    setTasks(prev => [task, ...prev]);
    setLogs(prev => [{ id: Date.now(), text: `New task added: ${newTask.title}`, time: now12(), type: "add" }, ...prev]);
    setNewTask({ title: "", description: "", deadline: "", subject: "CS", priority: "medium" });
    setShowModal(false);
  }

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (loading) return <LoadingScreen />;

  return (
    <div style={{ minHeight: "100vh", background: "#0a0e1a", fontFamily: "'DM Mono', monospace", display: "flex", overflow: "hidden" }}>
      
      <GlobalStyles />

      {/* SIDEBAR */}
      <Sidebar activePage="home" handleLogout={handleLogout} />

      {/* MAIN AREA */}
      <main style={{ marginLeft: 220, flex: 1, display: "flex", gap: 0, height: "100vh", overflow: "hidden" }}>

        {/* TASK BOARD */}
        <section style={{ flex: 1, minWidth: 0, padding: "32px 40px", overflowY: "auto", borderRight: "1px solid #1a2236" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
            <div>
              <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 800, color: "#e2eaf8", letterSpacing: -0.5 }}>Task Board</h1>
              <div style={{ color: "#4a6080", fontSize: 13, marginTop: 4 }}>{new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</div>
            </div>
            
            <button onClick={() => setShowModal(true)} style={{ whiteSpace: "nowrap", width: "fit-content", background: "linear-gradient(135deg,#3b82f6,#6366f1)", border: "none", borderRadius: 8, color: "#fff", padding: "10px 20px", fontSize: 13, fontFamily: "'Inter', sans-serif", cursor: "pointer", fontWeight: 600, display: "flex", alignItems: "center", gap: 8, boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)", flexShrink: 0 }}>
              <span style={{ fontSize: 16, fontWeight: 400 }}>+</span> New Task
            </button>
          </div>

          {pendingTasks.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: "#4a6080" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🎉</div>
              <div style={{ fontSize: 14, fontFamily: "'Inter', sans-serif" }}>All tasks completed!</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {pendingTasks.map(task => (
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  onComplete={handleComplete} 
                  onDelete={handleDelete} 
                  completingId={completingId} 
                />
              ))}
            </div>
          )}
        </section>

        {/* RIGHT PANEL: ACTIVITY FEED */}
        <aside style={{ width: 320, display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden", background: "#0a0e1a" }}>
          <div style={{ flex: 1, padding: "32px 24px 24px", display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, fontWeight: 700, color: "#e2eaf8" }}>Activity Feed</h2>
              <span style={{ background: "rgba(96,165,250,0.1)", color: "#60a5fa", fontSize: 10, padding: "4px 8px", borderRadius: 6, fontWeight: 700, fontFamily: "'Inter', sans-serif", letterSpacing: 0.5 }}>LIVE</span>
            </div>
            <div ref={logRef} style={{ overflowY: "auto", flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
              {logs.map((log, i) => (
                <div key={log.id} className="fade-in" style={{ background: "#0d1220", border: "1px solid #1e2a45", borderRadius: 12, padding: "14px 16px", opacity: 1 - i * 0.05 }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <span style={{ fontSize: 16, flexShrink: 0 }}>{LOG_ICONS[log.type] || "📌"}</span>
                    <div>
                      <div style={{ color: "#8da4c8", fontSize: 12, lineHeight: 1.5, fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>{log.text}</div>
                      <div style={{ color: "#4a6080", fontSize: 11, marginTop: 4 }}>{log.time}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </main>

      {/* ADD TASK MODAL */}
      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="fade-in" style={{ background: "#0d1220", border: "1px solid #1e2a45", borderRadius: 16, padding: 28, width: 420, maxWidth: "90vw" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
              <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 18, fontWeight: 800, color: "#e2eaf8" }}>Add New Task</h2>
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", color: "#4a6080", cursor: "pointer", fontSize: 18 }}>✕</button>
            </div>
            <form onSubmit={handleAddTask} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ color: "#4a6080", fontSize: 11, letterSpacing: 1, display: "block", marginBottom: 6, textTransform: "uppercase" }}>Title *</label>
                <input className="input-field" value={newTask.title} onChange={e => setNewTask(p => ({...p, title: e.target.value}))} placeholder="e.g. Midterm Review Notes" required />
              </div>
              <div>
                <label style={{ color: "#4a6080", fontSize: 11, letterSpacing: 1, display: "block", marginBottom: 6, textTransform: "uppercase" }}>Description</label>
                <textarea className="input-field" value={newTask.description} onChange={e => setNewTask(p => ({...p, description: e.target.value}))} placeholder="What needs to be done?" style={{ resize: "vertical", minHeight: 72 }} />
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ color: "#4a6080", fontSize: 11, letterSpacing: 1, display: "block", marginBottom: 6, textTransform: "uppercase" }}>Deadline *</label>
                  <input type="date" className="input-field" value={newTask.deadline} onChange={e => setNewTask(p => ({...p, deadline: e.target.value}))} required />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ color: "#4a6080", fontSize: 11, letterSpacing: 1, display: "block", marginBottom: 6, textTransform: "uppercase" }}>Subject</label>
                  <select className="input-field" value={newTask.subject} onChange={e => setNewTask(p => ({...p, subject: e.target.value}))}>
                    {["CS", "DBMS", "Math", "English", "Physics", "Other"].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label style={{ color: "#4a6080", fontSize: 11, letterSpacing: 1, display: "block", marginBottom: 8, textTransform: "uppercase" }}>Priority</label>
                <div style={{ display: "flex", gap: 8 }}>
                  {["high","medium","low"].map(p => {
                    const s = PRIORITY_STYLES[p];
                    return (
                      <button key={p} type="button" onClick={() => setNewTask(prev => ({...prev, priority: p}))}
                        style={{ flex: 1, background: newTask.priority === p ? s.bg : "transparent", border: `1px solid ${newTask.priority === p ? s.text : "#1e2a45"}`, borderRadius: 8, color: newTask.priority === p ? s.text : "#4a6080", padding: "8px", fontSize: 11, cursor: "pointer", fontFamily: "'DM Mono',monospace", transition: "all 0.2s", textTransform: "capitalize" }}>
                        {p}
                      </button>
                    );
                  })}
                </div>
              </div>
              <button type="submit" style={{ marginTop: 8, background: "linear-gradient(135deg,#3b82f6,#6366f1)", border: "none", borderRadius: 10, color: "#fff", padding: "12px", fontSize: 13, fontFamily: "'DM Mono',monospace", cursor: "pointer", fontWeight: 500, letterSpacing: 0.5 }}>
                ＋ Add Task
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}