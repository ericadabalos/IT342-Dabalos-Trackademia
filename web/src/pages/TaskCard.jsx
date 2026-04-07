import React from "react";
import { formatDeadline, SUBJECT_COLORS, PRIORITY_STYLES } from "./constants";

export default function TaskCard({ task, onComplete, onDelete, completingId }) {
  const dl = formatDeadline(task.deadline);
  const subColor = SUBJECT_COLORS[task.subject] || SUBJECT_COLORS.default;
  const pri = PRIORITY_STYLES[task.priority];
  const isCompleting = completingId === task.id;
  const isDone = task.status === "done";

  return (
    <div className={`task-card${isCompleting ? " completing" : " fade-in"}`}
      style={{ background: isDone ? "#0c1020" : "#0f1629", border: "1px solid #1a2236", borderLeft: `3px solid ${isDone ? "#2d3f5a" : subColor}`, borderRadius: 12, padding: "16px 18px", opacity: isDone ? 0.75 : 1 }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
            <span style={{ background: isDone ? "rgba(45,63,90,0.4)" : `${subColor}22`, color: isDone ? "#3d5278" : subColor, fontSize: 10, padding: "2px 8px", borderRadius: 4, fontWeight: 500, letterSpacing: 1 }}>{task.subject}</span>
            {!isDone && <span style={{ background: pri.bg, color: pri.text, fontSize: 10, padding: "2px 8px", borderRadius: 4 }}>{pri.label}</span>}
            {isDone
              ? <span style={{ background: "rgba(74,222,128,0.08)", color: "#4ade80", fontSize: 10, padding: "2px 8px", borderRadius: 4 }}>✅ Completed</span>
              : <span style={{ background: dl.urgent ? "rgba(239,68,68,0.1)" : "rgba(96,165,250,0.1)", color: dl.urgent ? "#f87171" : "#60a5fa", fontSize: 10, padding: "2px 8px", borderRadius: 4 }}>⏰ {dl.label}</span>
            }
          </div>
          <div style={{ color: isDone ? "#4a6080" : "#c8d6f0", fontSize: 14, fontWeight: 500, marginBottom: 4, textDecoration: isDone ? "line-through" : "none" }}>{task.title}</div>
          <div style={{ color: "#3d5278", fontSize: 12, lineHeight: 1.5 }}>{task.description}</div>
          {isDone && task.completedAt && <div style={{ color: "#2d3f5a", fontSize: 11, marginTop: 6 }}>Completed: {task.completedAt}</div>}
        </div>
        <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
          {!isDone && (
            <button className="done-btn" onClick={() => onComplete(task.id)} disabled={isCompleting}
              style={{ background: "transparent", border: "1px solid #1e2a45", borderRadius: 8, color: "#3d5278", padding: "8px 14px", fontSize: 11, fontFamily: "'DM Mono',monospace", letterSpacing: 0.5 }}>
              {isCompleting ? "..." : "✓ Done"}
            </button>
          )}
          <button className="del-btn" onClick={() => onDelete(task.id)}
            style={{ background: "transparent", border: "1px solid #1e2a45", borderRadius: 8, color: "#3d5278", padding: "8px 10px", fontSize: 11, fontFamily: "'DM Mono',monospace" }}>
            🗑
          </button>
        </div>
      </div>
    </div>
  );
}