import React, { useState, useEffect } from "react";
import { formatDeadline, SUBJECT_COLORS, PRIORITY_STYLES } from "./constants";
import { apiService } from "../services/apiService";

//changed onDelete to onEdit here
export default function TaskCard({ task, onComplete, onEdit, completingId }) {
  const dl = formatDeadline(task.deadline);
  const subColor = SUBJECT_COLORS[task.subject] || SUBJECT_COLORS.default;
  const pri = PRIORITY_STYLES[task.priority];
  
  const [isHidePending, setIsHidePending] = useState(task.hideRequested || false);
  const [isRequestingHide, setIsRequestingHide] = useState(false);

  useEffect(() => {
    setIsHidePending(task.hideRequested || false);
  }, [task.hideRequested]);

  const isCompleting = completingId === task.id;
  const isDone = task.status === "completed";
  const isOverdue = task.displayStatus === "overdue" || (task.status !== "completed" && new Date(task.deadline + "T00:00:00") < new Date());

  return (
    <div className={`task-card${isCompleting ? " completing" : " fade-in"}`}
      style={{ background: isDone ? "#0c1020" : "#0f1629", border: "1px solid #1a2236", borderLeft: `3px solid ${isDone ? "#2d3f5a" : subColor}`, borderRadius: 12, padding: "16px 18px", opacity: isDone ? 0.75 : 1 }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
            <span style={{ background: isDone ? "rgba(45,63,90,0.4)" : `${subColor}22`, color: isDone ? "#3d5278" : subColor, fontSize: 10, padding: "2px 8px", borderRadius: 4, fontWeight: 500, letterSpacing: 1 }}>{task.subject}</span>
            {!isDone && <span style={{ background: pri.bg, color: pri.text, fontSize: 10, padding: "2px 8px", borderRadius: 4 }}>{pri.label}</span>}
            
            {/*render the tag based on the 3 states*/}
            {isDone
              ? <span style={{ background: "rgba(74,222,128,0.08)", color: "#4ade80", fontSize: 10, padding: "2px 8px", borderRadius: 4 }}>✅ Completed</span>
              : isOverdue 
                ? <span style={{ background: "rgba(239,68,68,0.1)", color: "#f87171", fontSize: 10, padding: "2px 8px", borderRadius: 4 }}>🚨 Overdue</span>
                : <span style={{ background: dl.urgent ? "rgba(239,68,68,0.1)" : "rgba(96,165,250,0.1)", color: dl.urgent ? "#f87171" : "#60a5fa", fontSize: 10, padding: "2px 8px", borderRadius: 4 }}>⏰ {dl.label}</span>
            }

          </div>
          <div style={{ color: isDone ? "#4a6080" : "#c8d6f0", fontSize: 14, fontWeight: 500, marginBottom: 4, textDecoration: isDone ? "line-through" : "none" }}>{task.title}</div>
          <div style={{ color: "#3d5278", fontSize: 12, lineHeight: 1.5 }}>{task.description}</div>
          {isDone && task.completedAt && <div style={{ color: "#2d3f5a", fontSize: 11, marginTop: 6 }}>Completed: {task.completedAt}</div>}
        </div>
        <div style={{ display: "flex", gap: 6, flexShrink: 0, alignItems: "center" }}>
          {!isDone && (
            <button className="done-btn" onClick={() => onComplete(task.id)} disabled={isCompleting}
              style={{ background: "transparent", border: "1px solid #1e2a45", borderRadius: 8, color: "#3d5278", padding: "8px 14px", fontSize: 11, fontFamily: "'DM Mono',monospace", letterSpacing: 0.5 }}>
              {isCompleting ? "..." : "✓ Done"}
            </button>
          )}

          {isOverdue && (
            <button
              className={`hide-request-btn${isHidePending ? " pending" : ""}`}
              onClick={handleHideRequest}
              disabled={isHidePending || isRequestingHide}
              style={{
                background: "transparent",
                border: `1px solid ${isHidePending ? "#fbbf24" : "#4a6080"}`,
                color: isHidePending ? "#fbbf24" : "#4a6080",
                borderRadius: 8,
                padding: "8px 12px",
                fontSize: 11,
                fontFamily: "'DM Mono',monospace",
                cursor: isHidePending ? "not-allowed" : "pointer",
                opacity: isHidePending ? 0.75 : 1,
                whiteSpace: "nowrap",
                transition: "all 0.2s"
              }}
            >
              {isHidePending ? "Pending Approval" : "Request to Hide"}
            </button>
          )}
          
          {/*changed to an Edit Button passing the whole task object*/}
          <button className="edit-btn" onClick={() => onEdit(task)}
            style={{ background: "transparent", border: "1px solid #1e2a45", borderRadius: 8, color: "#3d5278", padding: "8px 10px", fontSize: 11, fontFamily: "'DM Mono',monospace", cursor: "pointer" }}>
            🖋
          </button>

        </div>
      </div>
    </div>
  );

  async function handleHideRequest(e) {
    e.stopPropagation();
    if (isHidePending || isRequestingHide) return;
    setIsRequestingHide(true);
    try {
      console.log("[DEBUG] handleHideRequest", { taskId: task.id, token: localStorage.getItem("token") ? "present" : "missing" });
      const result = await apiService.requestHideTask(task.id);
      console.log("[DEBUG] requestHideTask result:", result);
      setIsHidePending(true);
    } catch (error) {
      console.error("Hide request failed", error);
      alert(error.message || "Hide request failed");
    } finally {
      setIsRequestingHide(false);
    }
  }
}