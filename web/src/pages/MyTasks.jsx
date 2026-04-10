import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { ActivityFeed } from "./ActivityFeed";
import TaskCard from "./TaskCard";
import { PRIORITY_STYLES, SUBJECT_COLORS } from "./constants";
import { apiService } from "../services/apiService";
import styled from "styled-components";
import LoadingScreen from "./LoadingScreen";
import GlobalStyles from "./GlobalStyles";

const PageContainer = styled.div`
  display: flex;
  background: #0a0e1a;
  min-height: 100vh;
`;

const MainContent = styled.div`
  margin-left: 220px;
  flex: 1;
  padding: 40px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #e2eaf8;
  margin: 0;
`;

const NewTaskButton = styled.button`
  whiteSpace: nowrap;
  width: fit-content;
  background: linear-gradient(135deg, #3b82f6, #6366f1);
  border: none;
  border-radius: 8px;
  color: #fff;
  padding: 10px 20px;
  font-size: 13px;
  font-family: 'Inter', sans-serif;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  flex-shrink: 0;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 6px 16px rgba(59, 130, 246, 0.5);
  }

  &:active {
    transform: translateY(1px);
  }

  span {
    font-size: 16px;
    font-weight: 400;
  }
`;

const ContentWrapper = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 40px;
`;

const TasksSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const SectionTitle = styled.h2`
  font-size: 16px;
  font-weight: 600;
  color: #8da4c8;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const TasksContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: #0d1220;
  border: 1px solid #1e2a45;
  border-radius: 12px;
  padding: 20px;
  min-height: 300px;
`;

const TaskPlaceholder = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #4a6080;
  font-size: 14px;
  text-align: center;
`;

const ActivitySection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ActivityContainer = styled.div`
  background: #0d1220;
  border: 1px solid #1e2a45;
  border-radius: 12px;
  padding: 20px;
  max-height: 520px;
  overflow-y: auto;
  overscroll-behavior: contain;
`;

const ProgressBarContainer = styled.div`
  background: #0d1220;
  border: 1px solid #1e2a45;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 30px;
`;

const ProgressLabel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const ProgressText = styled.div`
  font-size: 13px;
  color: #8da4c8;
  font-weight: 500;
`;

const ProgressPercentage = styled.div`
  font-size: 14px;
  color: #60a5fa;
  font-weight: 700;
`;

const ProgressBarTrack = styled.div`
  width: 100%;
  height: 8px;
  background: #1a2a45;
  border-radius: 4px;
  overflow: hidden;
`;

const ProgressBarFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #60a5fa, #3b82f6);
  border-radius: 4px;
  width: ${props => props.percentage}%;
  transition: width 0.3s ease;
`;

export default function MyTasks() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activities, setActivities] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [completingId, setCompletingId] = useState(null);
  const [newTask, setNewTask] = useState({ title: "", description: "", deadline: "", subject: "CS", priority: "medium" });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse user data", error);
      }
    }

    // Fetch tasks and activities from backend
    const fetchData = async () => {
      try {
        const tasksData = await apiService.getTasks();
        setTasks(tasksData);
        
        const activitiesData = await apiService.getActivities();
        setActivities(activitiesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const pendingTasks = tasks.filter(t => t.status !== "completed");
  const completedTasks = tasks.filter(t => t.status === "completed").length;
  const totalTasks = tasks.length;
  const progressPercentage = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  function closeModal() {
    setShowModal(false);
    setEditingTaskId(null);
    setNewTask({ title: "", description: "", deadline: "", subject: "CS", priority: "medium" });
  }

  async function handleAddTask(e) {
    e.preventDefault();
    if (!newTask.title || !newTask.deadline) return;

    try {
      if (editingTaskId) {
        const updatedTask = await apiService.updateTask(editingTaskId, newTask);
        setTasks(prev => prev.map(t => t.id === editingTaskId ? updatedTask : t));
      } else {
        const savedTask = await apiService.createTask(newTask);
        setTasks(prev => [savedTask, ...prev]);
      }

      const activitiesData = await apiService.getActivities();
      setActivities(activitiesData);
      closeModal();
    } catch (error) {
      console.error("Failed to save task", error);
    }
  }

  async function handleComplete(id) {
    setCompletingId(id);
    try {
      const updatedTask = await apiService.completeTask(id);
      setTasks(prev => prev.map(t => t.id === id ? updatedTask : t));

      const activitiesData = await apiService.getActivities();
      setActivities(activitiesData);
    } catch (error) {
      console.error("Failed to complete task", error);
    } finally {
      setCompletingId(null);
    }
  }

  function handleEditClick(task) {
    setEditingTaskId(task.id);
    setNewTask(task);
    setShowModal(true);
  }

  if (loading) return <LoadingScreen />;

  return (
    <PageContainer>
      <GlobalStyles />
      <Sidebar activePage="tasks" handleLogout={handleLogout} />
      <MainContent>
        <Header>
          <Title>My Tasks</Title>
          <NewTaskButton onClick={() => setShowModal(true)}><span>+</span> New Task</NewTaskButton>
        </Header>

        <ProgressBarContainer>
          <ProgressLabel>
            <ProgressText>Task Completion Progress</ProgressText>
            <ProgressPercentage>{Math.round(progressPercentage)}%</ProgressPercentage>
          </ProgressLabel>
          <ProgressBarTrack>
            <ProgressBarFill percentage={progressPercentage} />
          </ProgressBarTrack>
          <div style={{ marginTop: 12, fontSize: 12, color: "#4a6080" }}>
            {completedTasks} of {totalTasks} tasks completed
          </div>
        </ProgressBarContainer>

        <ContentWrapper>
          <TasksSection>
            <SectionTitle>Active Tasks</SectionTitle>
            <TasksContainer>
              {pendingTasks.length === 0 ? (
                <TaskPlaceholder>
                  No tasks yet. Click "New Task" to get started!
                </TaskPlaceholder>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {pendingTasks.map(task => (
                    <TaskCard 
                      key={task.id} 
                      task={{ ...task, displayStatus: "pending" }} 
                      onComplete={handleComplete}
                      onEdit={handleEditClick}
                      completingId={completingId}
                    />
                  ))}
                </div>
              )}
            </TasksContainer>
          </TasksSection>

          <ActivitySection>
            <SectionTitle>Activity Feed</SectionTitle>
            <ActivityContainer>
              <ActivityFeed activities={activities} />
            </ActivityContainer>
          </ActivitySection>
        </ContentWrapper>
      </MainContent>

      {/* ADD/EDIT TASK MODAL */}
      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && closeModal()}>
          <div className="fade-in" style={{ background: "#0d1220", border: "1px solid #1e2a45", borderRadius: 16, padding: 28, width: 420, maxWidth: "90vw" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
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
              <button type="submit" style={{ marginTop: 8, background: "linear-gradient(135deg,#3b82f6,#6366f1)", border: "none", borderRadius: 10, color: "#fff", padding: "12px", fontSize: 13, fontFamily: "'DM Mono',monospace", cursor: "pointer", fontWeight: 500, letterSpacing: 0.5 }}>
                {editingTaskId ? "Save Changes" : "＋ Add Task"}
              </button>
            </form>
          </div>
        </div>
      )}
    </PageContainer>
  );
}