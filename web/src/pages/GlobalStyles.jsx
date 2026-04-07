import React from "react";

export default function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Inter:wght@400;500;600;700;800&family=Syne:wght@600;700;800&display=swap');
      * { box-sizing: border-box; margin: 0; padding: 0; }
      ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: #1e2a45; border-radius: 2px; }
      .nav-btn { background: none; border: none; cursor: pointer; transition: all 0.2s; }
      .nav-btn:hover { background: rgba(96,165,250,0.08) !important; }
      .nav-btn.active { background: #1a233a !important; color: #60a5fa !important; border-left: 3px solid #60a5fa !important; }
      .task-card { transition: transform 0.2s, box-shadow 0.2s; }
      .task-card:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(0,0,0,0.4) !important; }
      .done-btn { transition: all 0.2s; cursor: pointer; }
      .done-btn:hover { background: rgba(74,222,128,0.1) !important; border-color: #4ade80 !important; color: #4ade80 !important; }
      .del-btn { transition: all 0.2s; cursor: pointer; }
      .del-btn:hover { background: rgba(239,68,68,0.15) !important; border-color: #f87171 !important; color: #f87171 !important; }
      .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 100; }
      .input-field { background: #0f1629; border: 1px solid #1e2a45; border-radius: 8px; color: #c8d6f0; padding: 10px 14px; font-family: 'DM Mono', monospace; font-size: 13px; width: 100%; outline: none; transition: border-color 0.2s; }
      .input-field:focus { border-color: #60a5fa; }
      .fade-in { animation: fadeIn 0.3s ease; }
      @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
      .completing { animation: completeAnim 0.6s ease forwards; }
      @keyframes completeAnim { 0%{opacity:1;transform:none} 50%{opacity:0.3;transform:scale(0.97)} 100%{opacity:0;transform:scale(0.95)} }
    `}</style>
  );
}