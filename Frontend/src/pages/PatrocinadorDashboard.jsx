import React, { useState, useEffect } from "react";
import "../styles/PatrocinadorDashboard.css";
import { getUser, removeUser } from "../utils/auth";

export default function PatrocinadorDashboard() {
  const [usuario, setUsuario] = useState(null);
  const [vistaActiva, setVistaActiva] = useState("dashboard");

  useEffect(() => {
    const usuarioData = getUser();
    if (usuarioData) {
      setUsuario(usuarioData);
    }
  }, []);

  const cerrarSesion = async () => {
    const { logout } = await import("../utils/auth");
    await logout();
    window.location.href = "/iniciarsesion";
  };

  return (
    <div className="patrocinador-dashboard">
      <nav className="patrocinador-nav">
        <div className="patrocinador-logo">
          <img src="/img/Logo.png" alt="Logo" />
          <span>Travel Safely - Patrocinador</span>
        </div>
        <div className="patrocinador-user">
          <span>Hola, {usuario?.Nom_completo}</span>
          <button onClick={cerrarSesion} className="btn-cerrar-sesion">
            Cerrar Sesión
          </button>
        </div>
      </nav>

      <div className="patrocinador-content">
        <div className="patrocinador-sidebar">
          <button
            className={vistaActiva === "dashboard" ? "active" : ""}
            onClick={() => setVistaActiva("dashboard")}
          >
            🏠 Dashboard
          </button>
          <button
            className={vistaActiva === "perfil" ? "active" : ""}
            onClick={() => setVistaActiva("perfil")}
          >
            👤 Mi Perfil
          </button>
        </div>

        <div className="patrocinador-main">
          {vistaActiva === "dashboard" && (
            <div className="dashboard-view">
              <h1>Bienvenido, {usuario?.Nom_completo}</h1>
              <div className="welcome-message">
                <h2>Gracias por ser parte de Travel Safely</h2>
                <p>
                  Como patrocinador, tu apoyo es fundamental para que este servicio
                  de transporte empresarial siga siendo gratuito para todos.
                </p>
                <div className="dashboard-cards">
                  <div className="dashboard-card">
                    <h3>💼 Mi Contribución</h3>
                    <p>
                      Tu apoyo nos ayuda a mantener el servicio de transporte
                      gratuito para todas las empresas.
                    </p>
                  </div>
                  <div className="dashboard-card">
                    <h3>📊 Información</h3>
                    <p>
                      Aquí encontrarás información sobre tu perfil y
                      contribuciones.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {vistaActiva === "perfil" && (
            <div className="perfil-view">
              <h2>Mi Perfil</h2>
              <div className="perfil-info">
                <div className="info-item">
                  <strong>Nombre Completo:</strong>
                  <span>{usuario?.Nom_completo}</span>
                </div>
                <div className="info-item">
                  <strong>Email:</strong>
                  <span>{usuario?.Correo}</span>
                </div>
                <div className="info-item">
                  <strong>Teléfono:</strong>
                  <span>{usuario?.Telefono}</span>
                </div>
                <div className="info-item">
                  <strong>Dirección:</strong>
                  <span>{usuario?.direccion || "No registrada"}</span>
                </div>
                <div className="info-item">
                  <strong>Tipo de Usuario:</strong>
                  <span>{usuario?.Tip_usuario}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

