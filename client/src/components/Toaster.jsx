import React, { useState, useEffect } from "react";
import { CheckCircle2, AlertCircle, X, Info } from "lucide-react";

export default function Toaster({ toast, onClose }) {
  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 size={18} className="text-green" />,
    error: <AlertCircle size={18} className="text-red" />,
    info: <Info size={18} className="text-blue" />
  };

  return (
    <div className={`toast-container ${toast ? 'show' : ''}`}>
      <div className={`toast toast-${toast.type}`}>
        <div className="toast-icon">{icons[toast.type]}</div>
        <div className="toast-content">
          <div className="toast-message">{toast.message}</div>
        </div>
        <button className="toast-close" onClick={onClose}>
          <X size={14} />
        </button>
        <div className="toast-progress" style={{ animationDuration: '3000ms' }} />
      </div>
    </div>
  );
}
