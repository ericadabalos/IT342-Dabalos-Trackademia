import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import Sidebar from "./Sidebar";
import TaskCard from "./TaskCard"; 
import { formatDeadline, LOG_ICONS, SUBJECT_COLORS, PRIORITY_STYLES } from "./constants"; 
import LoadingScreen from "./LoadingScreen";
import GlobalStyles from "./GlobalStyles";
import { ActivityFeed } from "./ActivityFeed"; 
import { apiService } from "../services/apiService";


function checkStatus(task) {
  if (task.status === "completed") return "completed";
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const deadlineDate = new Date(task.deadline + "T00:00:00");
  if (deadlineDate < today) {
    return "overdue";
  }
  
  return "pending";
}

export default function Dashboard() {
  const [tasks, setTasks] = useState([]); 
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [completingId, setCompletingId] = useState(null);
  
  //new state to track if we are editing an existing task
  const [editingTaskId, setEditingTaskId] = useState(null); 
  
  const [newTask, setNewTask] = useState({ title: "", description: "", deadline: "", subject: "CS", priority: "medium" });
  
  const logRef = useRef(null);
  const navigate = useNavigate();
  const { logout } = useAuth();

  // Helper function to reload activities
  const reloadActivities = async () => {
    try {
      const updatedActivities = await apiService.getActivities();
      setActivities(updatedActivities);
    } catch (err) {
      console.error("Error reloading activities:", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tasksData = await apiService.getTasks();
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

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = 0;
  }, [activities]);

  const pendingTasks = tasks.filter(t => t.status !== "completed");
  const completedCount = tasks.filter(t => t.status === "completed").length;

  async function handleComplete(id) {
    setCompletingId(id);
    try {
      const updatedTask = await apiService.completeTask(id);
      
      setTasks(prev => prev.map(t => t.id === id ? updatedTask : t));
      
      // Reload activities to show the new completion log
      await reloadActivities();
    } catch (error) {
      console.error("Failed to complete task", error);
    } finally {
      setCompletingId(null);
    }
  }
  
  //new function to handle clicking the pencil icon
  function handleEditClick(task) {
    setEditingTaskId(task.id);      // Remember which task we are editing
    setNewTask(task);               // Fill the form with the existing data
    setShowModal(true);             // Open the modal
  }

  //helper to close modal and reset form
  function closeModal() {
    setShowModal(false);
    setEditingTaskId(null);
    setNewTask({ title: "", description: "", deadline: "", subject: "CS", priority: "medium" });
  }

  //updated to handle both ADDING and EDITING
  async function handleAddTask(e) {
    e.preventDefault();
    if (!newTask.title || !newTask.deadline) return;

    try {
      if (editingTaskId) {
        // --- EDIT EXISTING TASK ---
        const updatedTask = await apiService.updateTask(editingTaskId, newTask);
        
        // Update it in our state array
        setTasks(prev => prev.map(t => t.id === editingTaskId ? updatedTask : t));
      } else {
        // --- ADD NEW TASK ---
        const savedTask = await apiService.createTask(newTask);
        
        setTasks(prev => [savedTask, ...prev]);
      }
      
      // Reload activities to show the new task log
      await reloadActivities();
      
      closeModal(); // Reset form and close
    } catch (error) {
      console.error("Failed to save task", error);
    }
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
              {pendingTasks.map(task => {
                const currentStatus = checkStatus(task); 
                return (
                  <TaskCard 
                    key={task.id} 
                    task={{ ...task, displayStatus: currentStatus }} 
                    onComplete={handleComplete} 
                    onEdit={handleEditClick} 
                    completingId={completingId} 
                  />
                );
              })}
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
            <div ref={logRef} style={{ overflowY: "auto", flex: 1, paddingRight: 8 }}>
              <ActivityFeed activities={activities} />
            </div>
          </div>
        </aside>
      </main>

      {/* ADD/EDIT TASK MODAL */}
      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && closeModal()}>
          <div className="fade-in" style={{ background: "#0d1220", border: "1px solid #1e2a45", borderRadius: 16, padding: 28, width: 420, maxWidth: "90vw" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
              {/*dynamic modal title*/}
              <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 18, fontWeight: 800, color: "#e2eaf8" }}>
                {editingTaskId ? "Edit Task" : "Add New Task"}
              </h2>
              <button onClick={closeModal} style={{ background: "none", border: "none", color: "#4a6080", cursor: "pointer", fontSize: 18 }}>✕</button>
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
              {/*dynamic Submit Button*/}
              <button type="submit" style={{ marginTop: 8, background: "linear-gradient(135deg,#3b82f6,#6366f1)", border: "none", borderRadius: 10, color: "#fff", padding: "12px", fontSize: 13, fontFamily: "'DM Mono',monospace", cursor: "pointer", fontWeight: 500, letterSpacing: 0.5 }}>
                {editingTaskId ? "Save Changes" : "＋ Add Task"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}