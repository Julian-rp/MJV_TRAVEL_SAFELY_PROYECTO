import React, { useState, useEffect } from "react";
import "../styles/Notification.css";

export default function Notification({ message, type, onClose }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300); // Esperar a que termine la animación
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!visible) return null;

  return (
    <div className={`notification ${type} ${visible ? "show" : "hide"}`}>
      <div className="notification-content">
        <span className="notification-icon">
          {type === "success" ? "✅" : type === "error" ? "❌" : "⚠️"}
        </span>
        <span className="notification-message">{message}</span>
        <button
          onClick={() => {
            setVisible(false);
            setTimeout(onClose, 300);
          }}
          className="notification-close"
        >
          ×
        </button>
      </div>
    </div>
  );
}
