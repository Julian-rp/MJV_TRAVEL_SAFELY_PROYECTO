import React, { useState, useEffect } from "react";
import "../styles/UserDashboard.css";

export default function UserDashboard() {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    // Obtener datos del usuario desde localStorage
    const usuarioData = localStorage.getItem("usuario");
    if (usuarioData) {
      setUsuario(JSON.parse(usuarioData));
    }
  }, []);

  const cerrarSesion = async () => {
    const { logout } = await import("../utils/auth");
    await logout();
    window.location.href = "/iniciarsesion";
  };

  return (
    <div className="user-dashboard">
      <nav className="user-nav">
        <div className="user-logo">
          <img src="../img/Logo.png" alt="Logo" />
          <span>Travel Safely</span>
        </div>
        <div className="user-info">
          <span>Hola, {usuario?.Nom_completo}</span>
          <button onClick={cerrarSesion} className="btn-cerrar-sesion">
            Cerrar Sesión
          </button>
        </div>
      </nav>

      <div className="user-content">
        <h1>Mi Panel de Usuario</h1>

        <div className="user-cards">
          <div className="user-card">
            <h3>🚌 Mis Rutas</h3>
            <p>Ver y gestionar mis rutas asignadas</p>
            <button>Ver Mis Rutas</button>
          </div>

          <div className="user-card">
            <h3>📋 Solicitar Ruta</h3>
            <p>Solicitar una nueva ruta de transporte</p>
            <button onClick={() => (window.location.href = "/solicitarruta")}>
              Solicitar Ruta
            </button>
          </div>

          <div className="user-card">
            <h3>📊 Mi Perfil</h3>
            <p>Ver y editar mi información personal</p>
            <button>Ver Perfil</button>
          </div>

          <div className="user-card">
            <h3>📞 Contacto</h3>
            <p>Información de contacto y soporte</p>
            <button onClick={() => (window.location.href = "/nosotros")}>
              Contactar
            </button>
          </div>
        </div>

        <div className="user-info-section">
          <h3>Mi Información</h3>
          <div className="info-grid">
            <div className="info-item">
              <strong>Nombre:</strong> {usuario?.Nom_completo}
            </div>
            <div className="info-item">
              <strong>Tipo de Usuario:</strong> {usuario?.Tip_usuario}
            </div>
            <div className="info-item">
              <strong>Email:</strong> {usuario?.Correo}
            </div>
            <div className="info-item">
              <strong>Teléfono:</strong> {usuario?.Telefono}
            </div>
            <div className="info-item">
              <strong>Dirección:</strong> {usuario?.direccion}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
