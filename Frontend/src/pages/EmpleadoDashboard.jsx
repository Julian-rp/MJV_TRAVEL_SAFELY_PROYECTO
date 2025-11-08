import React, { useState, useEffect } from "react";
import "../styles/EmpleadoDashboard.css";
import { getUser, removeUser } from "../utils/auth";
import { empleadoService } from "../services/api";
import { emailService } from "../services/emailService";
import Breadcrumbs from "../components/Breadcrumbs";

export default function EmpleadoDashboard() {
  const [usuario, setUsuario] = useState(null);
  const [vistaActiva, setVistaActiva] = useState("dashboard");
  const [direccion, setDireccion] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mostrarSolicitarRuta, setMostrarSolicitarRuta] = useState(false);
  const [mostrarAvisoBienvenida, setMostrarAvisoBienvenida] = useState(false);
  const [datosSolicitud, setDatosSolicitud] = useState({
    horaSalida: "",
    horaEntrada: "",
    observaciones: "",
  });

  useEffect(() => {
    const usuarioData = getUser();
    if (usuarioData) {
      setUsuario(usuarioData);
      setDireccion(usuarioData.direccion || "");
      // Limpiar mensajes de error previos al cargar
      setMensaje("");
      cargarSolicitudes(usuarioData.id_usuario);
      
      // Mostrar aviso de bienvenida y enviar email solo la primera vez al iniciar sesión
      const ultimoLogin = localStorage.getItem('ultimoLogin');
      const ahora = new Date().getTime();
      // Si no hay último login o pasaron más de 5 minutos, mostrar bienvenida y enviar email
      if (!ultimoLogin || (ahora - parseInt(ultimoLogin)) > 300000) {
        setMostrarAvisoBienvenida(true);
        localStorage.setItem('ultimoLogin', ahora.toString());
        
        // Enviar email de bienvenida
        emailService.enviarEmailBienvenida(
          usuarioData.Correo,
          usuarioData.Nom_completo
        ).then((result) => {
          if (!result.exito) {
            console.warn('⚠️ No se pudo enviar el email de bienvenida:', result.mensaje);
          }
        }).catch((error) => {
          console.error('Error al enviar email de bienvenida:', error);
        });
      }
    }
    // Refrescar solicitudes cada 10 segundos para ver notificaciones
    const interval = setInterval(() => {
      if (usuario) {
        cargarSolicitudes(usuario.id_usuario);
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [usuario]);

  const cargarSolicitudes = async (idUsuario) => {
    try {
      const result = await empleadoService.obtenerMisSolicitudes(idUsuario);
      if (result.exito) {
        setSolicitudes(result.data);
      } else {
        console.warn("No se pudieron cargar las solicitudes:", result.mensaje);
      }
    } catch (error) {
      console.error("Error al cargar solicitudes:", error);
      // No mostrar error al usuario si es solo carga de solicitudes
      // Solo mostrar error si el usuario intenta hacer una acción
    }
  };

  // Obtener solicitudes aceptadas (notificaciones)
  const solicitudesAceptadas = solicitudes.filter(
    (s) => s.Estado === "Aceptada" && s.ruta
  );
  
  // Contador de solicitudes nuevas aceptadas
  const nuevasAceptadas = solicitudesAceptadas.filter(
    (s) => {
      const fechaAceptacion = new Date(s.FechaRespuesta);
      const ahora = new Date();
      const diferencia = ahora - fechaAceptacion;
      return diferencia < 3600000; // Menos de 1 hora
    }
  ).length;

  const actualizarDireccion = async () => {
    if (!direccion.trim()) {
      setMensaje("❌ Por favor, ingrese una dirección");
      return;
    }

    setLoading(true);
    setMensaje("");

    try {
      const result = await empleadoService.actualizarDireccion(
        usuario.id_usuario,
        direccion
      );

      if (result.exito) {
        setMensaje("✅ Dirección actualizada correctamente");
        // Actualizar usuario en localStorage
        const usuarioActualizado = { ...usuario, direccion };
        localStorage.setItem("usuario", JSON.stringify(usuarioActualizado));
        setUsuario(usuarioActualizado);
      } else {
        setMensaje(`❌ ${result.mensaje}`);
      }
    } catch (error) {
      setMensaje("❌ Error al actualizar la dirección");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const solicitarRuta = async () => {
    if (!usuario.direccion) {
      setMensaje("❌ Debe registrar su dirección antes de solicitar una ruta");
      return;
    }

    setLoading(true);
    setMensaje("");

    try {
      console.log("Enviando solicitud de ruta:", {
        idUsuario: usuario.id_usuario,
        datosSolicitud
      });

      const result = await empleadoService.solicitarRuta(
        usuario.id_usuario,
        datosSolicitud
      );

      console.log("Respuesta del servidor:", result);

      if (result && result.exito) {
        setMensaje("✅ Solicitud creada correctamente. Los conductores la verán y te notificarán cuando la acepten.");
        
        setDatosSolicitud({ horaSalida: "", horaEntrada: "", observaciones: "" });
        setMostrarSolicitarRuta(false);
        cargarSolicitudes(usuario.id_usuario);

        // Email de confirmación de solicitud de ruta desactivado
        // Solo mantenemos emails de bienvenida y restablecimiento de contraseña
      } else {
        const errorMsg = result?.mensaje || "Error desconocido al crear la solicitud";
        setMensaje(`❌ ${errorMsg}`);
        console.error("Error en la respuesta:", result);
      }
    } catch (error) {
      console.error("Error completo al solicitar ruta:", error);
      console.error("Detalles del error:", {
        message: error.message,
        response: error.response,
        stack: error.stack
      });
      
      let mensajeError = "Error desconocido al solicitar la ruta";
      if (error.message) {
        mensajeError = error.message;
      } else if (error.response?.data?.mensaje) {
        mensajeError = error.response.data.mensaje;
      } else if (typeof error === 'string') {
        mensajeError = error;
      }
      
      setMensaje(`❌ Error: ${mensajeError}. Por favor, verifica que el servidor esté corriendo y que tengas conexión a internet.`);
    } finally {
      setLoading(false);
    }
  };

  const cerrarSesion = async () => {
    const { logout } = await import("../utils/auth");
    await logout();
    window.location.href = "/iniciarsesion";
  };

  return (
    <div className="empleado-dashboard">
      <nav className="empleado-nav">
        <div className="empleado-logo">
          <img src="/img/Logo.png" alt="Logo" />
          <span>Travel Safely - Empleado</span>
        </div>
        <div className="empleado-user">
          <span>Hola, {usuario?.Nom_completo}</span>
          <button onClick={cerrarSesion} className="btn-cerrar-sesion">
            Cerrar Sesión
          </button>
        </div>
      </nav>

      <Breadcrumbs />

      <div className="empleado-content">
        <div className="empleado-sidebar">
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
          <button
            className={vistaActiva === "direccion" ? "active" : ""}
            onClick={() => setVistaActiva("direccion")}
          >
            📍 Registrar Dirección
          </button>
          <button
            className={vistaActiva === "solicitudes" ? "active" : ""}
            onClick={() => {
              setVistaActiva("solicitudes");
              if (usuario) cargarSolicitudes(usuario.id_usuario);
            }}
          >
            📋 Mis Solicitudes
            {nuevasAceptadas > 0 && (
              <span className="badge-notificacion">{nuevasAceptadas}</span>
            )}
          </button>
        </div>

        <div className="empleado-main">
          {mostrarAvisoBienvenida && (
            <div className="aviso-bienvenida">
              <div className="aviso-bienvenida-content">
                <h3>👋 ¡Bienvenido de nuevo, {usuario?.Nom_completo}!</h3>
                <p>Estamos aquí para ayudarte con tu transporte. Puedes solicitar una ruta, ver tus solicitudes y más.</p>
                <button 
                  onClick={() => setMostrarAvisoBienvenida(false)}
                  className="btn-cerrar-aviso"
                >
                  Entendido
                </button>
              </div>
            </div>
          )}
          {mensaje && (
            <div
              className={`mensaje ${mensaje.includes("✅") ? "exito" : "error"}`}
            >
              {mensaje}
            </div>
          )}

          {vistaActiva === "dashboard" && (
            <div className="dashboard-view">
              <h1>Bienvenido, {usuario?.Nom_completo}</h1>
              <div className="dashboard-cards">
                <div className="dashboard-card">
                  <h3>📍 Mi Dirección</h3>
                  <p>{usuario?.direccion || "No registrada"}</p>
                  <button onClick={() => setVistaActiva("direccion")}>
                    {usuario?.direccion ? "Actualizar" : "Registrar"}
                  </button>
                </div>
                <div className="dashboard-card">
                  <h3>📋 Mis Solicitudes</h3>
                  <p>
                    {solicitudes.length} solicitud(es) -{" "}
                    {solicitudesAceptadas.length} aceptada(s)
                  </p>
                  {nuevasAceptadas > 0 && (
                    <p className="notificacion-badge">
                      ¡{nuevasAceptadas} nueva(s) aceptada(s)!
                    </p>
                  )}
                  <button
                    onClick={() => {
                      setVistaActiva("solicitudes");
                      if (usuario) cargarSolicitudes(usuario.id_usuario);
                    }}
                  >
                    Ver Solicitudes
                  </button>
                </div>
                <div className="dashboard-card">
                  <h3>➕ Solicitar Ruta</h3>
                  <p>Solicita una nueva ruta de transporte</p>
                  <button onClick={() => setMostrarSolicitarRuta(true)}>
                    Solicitar
                  </button>
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
                  <strong>Tipo de Usuario:</strong>
                  <span>{usuario?.Tip_usuario}</span>
                </div>
                <div className="info-item">
                  <strong>Dirección:</strong>
                  <span>{usuario?.direccion || "No registrada"}</span>
                </div>
              </div>
            </div>
          )}

          {vistaActiva === "direccion" && (
            <div className="direccion-view">
              <h2>Registrar Dirección</h2>
              <div className="form-group">
                <label>Dirección Completa *</label>
                <input
                  type="text"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  placeholder="Ej. Calle 45 #10-21, Barrio Centro"
                  className="input-field"
                />
              </div>
              <button
                onClick={actualizarDireccion}
                disabled={loading}
                className="btn-primary"
              >
                {loading ? "Guardando..." : "Guardar Dirección"}
              </button>
            </div>
          )}

          {vistaActiva === "solicitudes" && (
            <div className="solicitudes-view">
              <div className="section-header">
                <h2>Mis Solicitudes de Ruta</h2>
                <button
                  onClick={() => setMostrarSolicitarRuta(true)}
                  className="btn-primary"
                >
                  + Nueva Solicitud
                </button>
              </div>
              
              {solicitudes.length === 0 ? (
                <p className="empty-state">
                  No tienes solicitudes. Solicita una ruta para comenzar.
                </p>
              ) : (
                <div className="solicitudes-list">
                  {solicitudes.map((solicitud) => (
                    <div
                      key={solicitud.Id_solicitud}
                      className={`solicitud-card ${
                        solicitud.Estado === "Aceptada" ? "aceptada" : ""
                      }`}
                    >
                      <div className="solicitud-header">
                        <h4>Solicitud #{solicitud.Id_solicitud}</h4>
                        <span
                          className={`estado-badge estado-${solicitud.Estado.toLowerCase()}`}
                        >
                          {solicitud.Estado}
                        </span>
                      </div>

                      <div className="solicitud-info">
                        <p>
                          <strong>📅 Fecha Solicitud:</strong>{" "}
                          {new Date(solicitud.FechaSolicitud).toLocaleString()}
                        </p>
                        <p>
                          <strong>📍 Dirección:</strong> {solicitud.Direccion}
                        </p>
                        {solicitud.Hora_Salida && (
                          <p>
                            <strong>⏰ Hora Salida Solicitada:</strong>{" "}
                            {new Date(solicitud.Hora_Salida).toLocaleString()}
                          </p>
                        )}
                        {solicitud.Hora_Entrada && (
                          <p>
                            <strong>⏰ Hora Entrada Solicitada:</strong>{" "}
                            {new Date(solicitud.Hora_Entrada).toLocaleString()}
                          </p>
                        )}
                      </div>

                      {/* Notificación de Ruta Aceptada */}
                      {solicitud.Estado === "Aceptada" && solicitud.ruta && (
                        <div className="notificacion-ruta-aceptada">
                          <div className="notificacion-header">
                            <h5>¡Tu solicitud fue aceptada!</h5>
                            <span className="badge-nuevo">NUEVO</span>
                          </div>
                          <div className="datos-ruta">
                            <p className="titulo-datos">Datos de tu Ruta:</p>
                            <div className="info-grid">
                              <div className="info-item-ruta">
                                <strong style={{ color: '#ff4444' }}>🚗 Placas:</strong>
                                <span style={{ color: '#666', marginLeft: '0.5rem' }}>
                                  {solicitud.ruta.Placas}
                                </span>
                              </div>
                              <div className="info-item-ruta">
                                <strong style={{ color: '#ff4444' }}>⏰ Hora de Salida:</strong>
                                <span style={{ color: '#666', marginLeft: '0.5rem' }}>
                                  {new Date(solicitud.ruta.Hora_Salida).toLocaleString('es-ES', {
                                    day: 'numeric',
                                    month: 'numeric',
                                    year: 'numeric',
                                    hour: 'numeric',
                                    minute: '2-digit',
                                    hour12: true
                                  })}
                                </span>
                              </div>
                              <div className="info-item-ruta">
                                <strong style={{ color: '#ff4444' }}>⏰ Hora de Entrada:</strong>
                                <span style={{ color: '#666', marginLeft: '0.5rem' }}>
                                  {new Date(solicitud.ruta.Hora_Entrada).toLocaleString('es-ES', {
                                    day: 'numeric',
                                    month: 'numeric',
                                    year: 'numeric',
                                    hour: 'numeric',
                                    minute: '2-digit',
                                    hour12: true
                                  })}
                                </span>
                              </div>
                              {solicitud.ruta.Marca && (
                                <div className="info-item-ruta">
                                  <strong style={{ color: '#ff4444' }}>🏭 Marca:</strong>
                                  <span style={{ color: '#666', marginLeft: '0.5rem' }}>
                                    {solicitud.ruta.Marca}
                                  </span>
                                </div>
                              )}
                              {solicitud.ruta.Direccion_Encuentro && (
                                <div className="info-item-ruta">
                                  <strong style={{ color: '#ff4444' }}>📍 Dirección de Encuentro:</strong>
                                  <span style={{ color: '#666', marginLeft: '0.5rem' }}>
                                    {solicitud.ruta.Direccion_Encuentro}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {solicitud.Estado === "Rechazada" && (
                        <div className="notificacion-rechazada">
                          <p>
                            <strong>❌ Tu solicitud fue rechazada</strong>
                          </p>
                          {solicitud.Observaciones && (
                            <p>Motivo: {solicitud.Observaciones}</p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {mostrarSolicitarRuta && (
        <div className="modal-overlay" onClick={() => setMostrarSolicitarRuta(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Solicitar Nueva Ruta</h3>
            <p className="modal-subtitle">
              Los conductores verán tu solicitud y te notificarán cuando la
              acepten con los datos del vehículo.
            </p>
            <div className="form-group">
              <label>Hora de Salida Deseada (Opcional)</label>
              <input
                type="datetime-local"
                value={datosSolicitud.horaSalida}
                onChange={(e) =>
                  setDatosSolicitud({ ...datosSolicitud, horaSalida: e.target.value })
                }
                className="input-field"
              />
            </div>
            <div className="form-group">
              <label>Hora de Entrada Deseada (Opcional)</label>
              <input
                type="datetime-local"
                value={datosSolicitud.horaEntrada}
                onChange={(e) =>
                  setDatosSolicitud({ ...datosSolicitud, horaEntrada: e.target.value })
                }
                className="input-field"
              />
            </div>
            <div className="form-group">
              <label>Observaciones (Opcional)</label>
              <textarea
                value={datosSolicitud.observaciones}
                onChange={(e) =>
                  setDatosSolicitud({ ...datosSolicitud, observaciones: e.target.value })
                }
                placeholder="Información adicional sobre tu solicitud..."
                className="input-field"
                rows="3"
              />
            </div>
            <div className="modal-actions">
              <button
                onClick={() => setMostrarSolicitarRuta(false)}
                className="btn-secondary"
              >
                Cancelar
              </button>
              <button onClick={solicitarRuta} disabled={loading} className="btn-primary">
                {loading ? "Solicitando..." : "Solicitar Ruta"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

