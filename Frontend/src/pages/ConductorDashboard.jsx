import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ConductorDashboard.css";
import { getUser, removeUser } from "../utils/auth";
import { conductorService, rutasService } from "../services/api";
import { API_BASE_URL } from "../config/constants";
import Breadcrumbs from "../components/Breadcrumbs";

export default function ConductorDashboard() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [vistaActiva, setVistaActiva] = useState("dashboard");
  const [empleados, setEmpleados] = useState([]);
  const [misRutas, setMisRutas] = useState([]);
  const [solicitudesPendientes, setSolicitudesPendientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [mostrarAgregarRuta, setMostrarAgregarRuta] = useState(false);
  const [datosRuta, setDatosRuta] = useState({
    Placas: "",
    Marca: "",
    Capacidad: 20,
    Papeles_Vehiculo: "",
    Hora_Salida: "",
    Hora_Entrada: "",
    Id_usuario: null,
  });
  const [rutaEditando, setRutaEditando] = useState(null);
  const [mostrarMapa, setMostrarMapa] = useState(false);
  const [empleadosEnRuta, setEmpleadosEnRuta] = useState([]);
  const [rutaSeleccionadaMapa, setRutaSeleccionadaMapa] = useState(null);

  useEffect(() => {
    const usuarioData = getUser();
    if (usuarioData) {
      setUsuario(usuarioData);
      
      // Verificar que el usuario sea conductor
      const tipoUsuario = usuarioData.Tip_usuario?.toLowerCase().trim();
      const esConductor = tipoUsuario === 'conductor' || 
                         tipoUsuario === 'conductor de ruta' ||
                         tipoUsuario.includes('conductor');
      
      if (!esConductor) {
        setMensaje(`⚠️ Advertencia: Tu usuario tiene el rol "${usuarioData.Tip_usuario}". Para aceptar solicitudes, necesitas tener el rol "Conductor". Contacta al administrador para actualizar tu rol.`);
      }
      
      cargarEmpleados();
      cargarMisRutas(usuarioData.id_usuario);
      cargarSolicitudesPendientes();
    }
  }, []);

  const cargarEmpleados = async () => {
    try {
      const result = await conductorService.obtenerEmpleadosConDirecciones();
      if (result.exito) {
        setEmpleados(result.data);
      }
    } catch (error) {
      console.error("Error al cargar empleados:", error);
    }
  };

  const cargarSolicitudesPendientes = async () => {
    try {
      // No limpiar mensajes aquí para no ocultar errores importantes
      const result = await conductorService.obtenerSolicitudesPendientes();
      if (result && result.exito) {
        setSolicitudesPendientes(result.data || []);
        // Si se cargaron correctamente, limpiar errores anteriores
        if (mensaje && mensaje.includes("conductor")) {
          setMensaje("");
        }
      } else if (result && result.mensaje) {
        // Si hay un mensaje de error en el resultado, mostrarlo
        setMensaje(`⚠️ ${result.mensaje}`);
        setSolicitudesPendientes([]);
      } else {
        setSolicitudesPendientes([]);
      }
    } catch (error) {
      console.error("Error al cargar solicitudes:", error);
      setSolicitudesPendientes([]);
      // Solo mostrar error si es un error de conexión
      if (error.message && (error.message.includes("conectar") || error.message.includes("Failed to fetch"))) {
        setMensaje(`❌ ${error.message}`);
      }
    }
  };

  const cargarMisRutas = async (idUsuario) => {
    try {
      const todasLasRutas = await conductorService.obtenerRutas();
      // Filtrar rutas del conductor usando Id_conductor
      const rutasDelConductor = todasLasRutas.filter(
        (ruta) => ruta.Id_conductor === idUsuario
      );
      
      // Mapear rutas con empleados asignados desde la relación ruta_empleado
      const rutasConEmpleados = rutasDelConductor.map(ruta => {
        const empleadosAsignados = ruta.ruta_empleado?.map(re => re.usuario).filter(Boolean) || [];
        
        return {
          ...ruta,
          empleadosAsignados
        };
      });
      
      setMisRutas(rutasConEmpleados);
    } catch (error) {
      console.error("Error al cargar rutas:", error);
      setMisRutas([]);
    }
  };

  const agregarRuta = async () => {
    if (!datosRuta.Placas.trim()) {
      setMensaje("❌ Por favor, ingrese las placas del vehículo");
      return;
    }

    if (!datosRuta.Capacidad || datosRuta.Capacidad < 1) {
      setMensaje("❌ La capacidad debe ser mayor a 0");
      return;
    }

    setLoading(true);
    setMensaje("");

    try {
      const datosRutaCompletos = {
        Placas: datosRuta.Placas,
        Marca: datosRuta.Marca || null,
        Capacidad: parseInt(datosRuta.Capacidad) || 20,
        Papeles_Vehiculo: datosRuta.Papeles_Vehiculo || null,
        Id_conductor: usuario.id_usuario,
        Hora_Salida: datosRuta.Hora_Salida
          ? new Date(datosRuta.Hora_Salida).toISOString()
          : new Date().toISOString(),
        Hora_Entrada: datosRuta.Hora_Entrada
          ? new Date(datosRuta.Hora_Entrada).toISOString()
          : new Date().toISOString(),
      };

      let result;
      if (rutaEditando) {
        // Actualizar ruta existente
        result = await rutasService.update(rutaEditando.Id_ruta, datosRutaCompletos);
        setMensaje("✅ Ruta actualizada correctamente");
      } else {
        // Crear nueva ruta
        result = await rutasService.create(datosRutaCompletos);
        setMensaje("✅ Ruta agregada correctamente");
      }

      if (result) {
        setDatosRuta({
          Placas: "",
          Marca: "",
          Capacidad: 20,
          Papeles_Vehiculo: "",
          Hora_Salida: "",
          Hora_Entrada: "",
          Id_usuario: null,
        });
        setRutaEditando(null);
        setMostrarAgregarRuta(false);
        cargarMisRutas(usuario.id_usuario);
      }
    } catch (error) {
      setMensaje(`❌ Error al ${rutaEditando ? 'actualizar' : 'agregar'} la ruta: ${error.message}`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const [mostrarModalAceptar, setMostrarModalAceptar] = useState(false);
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState(null);
  const [datosAceptar, setDatosAceptar] = useState({
    placas: "",
    marca: "",
    capacidad: 20,
    papelesVehiculo: "",
    direccionEncuentro: "",
  });

  const aceptarSolicitud = async () => {
    if (!datosAceptar.placas.trim()) {
      setMensaje("❌ Las placas son requeridas");
      return;
    }

    if (!datosAceptar.direccionEncuentro.trim()) {
      setMensaje("❌ La dirección de encuentro es requerida");
      return;
    }

    // Verificar que el usuario sea conductor antes de intentar aceptar
    if (!usuario || usuario.Tip_usuario !== 'Conductor') {
      setMensaje("❌ Solo los conductores pueden aceptar solicitudes. Verifica que tu usuario tenga el rol de 'Conductor'.");
      return;
    }

    setLoading(true);
    setMensaje("");
    try {
      const result = await conductorService.aceptarSolicitud(
        solicitudSeleccionada.Id_solicitud,
        usuario.id_usuario,
        {
          placas: datosAceptar.placas,
          marca: datosAceptar.marca,
          capacidad: parseInt(datosAceptar.capacidad) || 20,
          papelesVehiculo: datosAceptar.papelesVehiculo || null,
          direccionEncuentro: datosAceptar.direccionEncuentro || solicitudSeleccionada.Direccion,
        }
      );

      if (result.exito) {
        setMensaje("✅ Solicitud aceptada y ruta creada correctamente. El empleado recibirá una notificación.");
        setMostrarModalAceptar(false);
        setDatosAceptar({ placas: "", marca: "", capacidad: 20, papelesVehiculo: "", direccionEncuentro: "" });
        setSolicitudSeleccionada(null);
        cargarSolicitudesPendientes();
        cargarMisRutas(usuario.id_usuario);
      } else {
        setMensaje(`❌ ${result.mensaje}`);
      }
    } catch (error) {
      console.error("Error completo al aceptar solicitud:", error);
      setMensaje(`❌ Error al aceptar la solicitud: ${error.message || 'Error desconocido'}`);
    } finally {
      setLoading(false);
    }
  };

  const abrirModalAceptar = (solicitud) => {
    setSolicitudSeleccionada(solicitud);
    setDatosAceptar({
      placas: "",
      marca: "",
      capacidad: 20,
      papelesVehiculo: "",
      direccionEncuentro: solicitud.Direccion || "",
    });
    setMostrarModalAceptar(true);
  };

  const rechazarSolicitud = async (idSolicitud) => {
    const motivo = prompt("Ingrese el motivo del rechazo (opcional):");
    setLoading(true);
    setMensaje("");
    try {
      const result = await conductorService.rechazarSolicitud(
        idSolicitud,
        usuario.id_usuario,
        motivo || undefined
      );

      if (result.exito) {
        setMensaje("✅ Solicitud rechazada correctamente");
        cargarSolicitudesPendientes();
      } else {
        setMensaje(`❌ ${result.mensaje}`);
      }
    } catch (error) {
      setMensaje(`❌ Error al rechazar la solicitud: ${error.message}`);
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
    <div className="conductor-dashboard">
      <nav className="conductor-nav">
        <div className="conductor-logo">
          <img src="/img/Logo.png" alt="Logo" />
          <span>Travel Safely - Conductor</span>
        </div>
        <div className="conductor-user">
          <span>Hola, {usuario?.Nom_completo}</span>
          <button onClick={cerrarSesion} className="btn-cerrar-sesion">
            Cerrar Sesión
          </button>
        </div>
      </nav>

      <Breadcrumbs />

      <div className="conductor-content">
        <div className="conductor-sidebar">
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
            className={vistaActiva === "rutas" ? "active" : ""}
            onClick={() => setVistaActiva("rutas")}
          >
            🚌 Mis Rutas
          </button>
          <button
            className={vistaActiva === "pasajeros" ? "active" : ""}
            onClick={() => setVistaActiva("pasajeros")}
          >
            👥 Pasajeros
          </button>
          <button
            className={vistaActiva === "solicitudes" ? "active" : ""}
            onClick={() => {
              setVistaActiva("solicitudes");
              cargarSolicitudesPendientes();
            }}
          >
            📋 Solicitudes Pendientes
            {solicitudesPendientes.length > 0 && (
              <span className="badge">{solicitudesPendientes.length}</span>
            )}
          </button>
        </div>

        <div className="conductor-main">
          {mensaje && (
            <div
              className={`mensaje ${
                mensaje.includes("✅") 
                  ? "exito" 
                  : mensaje.includes("⚠️") 
                  ? "advertencia" 
                  : "error"
              }`}
            >
              <span>{mensaje}</span>
              <button
                onClick={() => setMensaje("")}
                title="Cerrar"
                aria-label="Cerrar mensaje"
              >
                ✕
              </button>
            </div>
          )}

          {vistaActiva === "dashboard" && (
            <div className="dashboard-view">
              <h1>Bienvenido, {usuario?.Nom_completo}</h1>
              <div className="dashboard-cards">
                <div className="dashboard-card">
                  <h3>🚌 Mis Rutas</h3>
                  <p>Tienes {misRutas.length} ruta(s) asignada(s)</p>
                  <button onClick={() => setVistaActiva("rutas")}>
                    Ver Rutas
                  </button>
                </div>
                <div className="dashboard-card">
                  <h3>👥 Pasajeros</h3>
                  <p>{empleados.length} empleado(s) registrado(s)</p>
                  <button onClick={() => setVistaActiva("pasajeros")}>
                    Ver Pasajeros
                  </button>
                </div>
                <div className="dashboard-card">
                  <h3>📋 Solicitudes Pendientes</h3>
                  <p>
                    {solicitudesPendientes.length} solicitud(es) esperando
                    respuesta
                  </p>
                  <button
                    onClick={() => {
                      setVistaActiva("solicitudes");
                      cargarSolicitudesPendientes();
                    }}
                  >
                    Ver Solicitudes
                  </button>
                </div>
                <div className="dashboard-card">
                  <h3>➕ Agregar Ruta</h3>
                  <p>Agrega una nueva ruta de transporte</p>
                  <button onClick={() => setMostrarAgregarRuta(true)}>
                    Agregar
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
              </div>
            </div>
          )}

          {vistaActiva === "rutas" && (
            <div className="rutas-view">
              <div className="section-header">
                <h2>Mis Rutas</h2>
                <button
                  onClick={() => {
                    setRutaEditando(null);
                    setDatosRuta({
                      Placas: "",
                      Marca: "",
                      Capacidad: 20,
                      Papeles_Vehiculo: "",
                      Hora_Salida: "",
                      Hora_Entrada: "",
                      Id_usuario: null,
                    });
                    setMostrarAgregarRuta(true);
                  }}
                  className="btn-primary"
                >
                  + Agregar Nueva Ruta
                </button>
              </div>
              {misRutas.length === 0 ? (
                <p>No tienes rutas asignadas. Agrega una ruta para comenzar.</p>
              ) : (
                <div className="rutas-list">
                  {misRutas.map((ruta) => {
                    // Obtener empleados asignados a esta ruta desde la relación
                    const empleadosAsignados = ruta.empleadosAsignados || [];
                    const puestosOcupados = empleadosAsignados.length;
                    const puestosDisponibles = ruta.Capacidad || 20;
                    const capacidadCompleta = puestosOcupados >= puestosDisponibles;

                    return (
                      <div key={ruta.Id_ruta} className="ruta-card">
                        <div className="ruta-card-header">
                          <h4>Ruta #{ruta.Id_ruta}</h4>
                          {capacidadCompleta && (
                            <span className="badge-completa">COMPLETA</span>
                          )}
                        </div>
                        <div className="ruta-info-grid">
                          <p>
                            <strong>🚗 Placas:</strong> {ruta.Placas || "No registrada"}
                          </p>
                          {ruta.Marca && (
                            <p>
                              <strong>🏭 Marca:</strong> {ruta.Marca}
                            </p>
                          )}
                          <p>
                            <strong>👥 Capacidad:</strong> {puestosOcupados} / {puestosDisponibles} puestos
                          </p>
                          {ruta.Papeles_Vehiculo && (
                            <p>
                              <strong>📄 Papeles:</strong> {ruta.Papeles_Vehiculo}
                            </p>
                          )}
                          <p>
                            <strong>⏰ Hora Salida:</strong>{" "}
                            {new Date(ruta.Hora_Salida).toLocaleString()}
                          </p>
                          <p>
                            <strong>⏰ Hora Entrada:</strong>{" "}
                            {new Date(ruta.Hora_Entrada).toLocaleString()}
                          </p>
                          {ruta.Direccion_Encuentro && (
                            <p>
                              <strong>📍 Dirección Encuentro:</strong> {ruta.Direccion_Encuentro}
                            </p>
                          )}
                        </div>
                        
                        {empleadosAsignados.length > 0 && (
                          <div className="empleados-ruta">
                            <strong>Empleados en esta ruta:</strong>
                            <ul>
                              {empleadosAsignados.map((emp) => (
                                <li key={emp.id_usuario}>
                                  {emp.Nom_completo} - {emp.direccion}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <div className="ruta-actions">
                          <button
                            onClick={() => {
                              setRutaEditando(ruta);
                              setDatosRuta({
                                Placas: ruta.Placas || "",
                                Marca: ruta.Marca || "",
                                Capacidad: ruta.Capacidad || 20,
                                Papeles_Vehiculo: ruta.Papeles_Vehiculo || "",
                                Hora_Salida: ruta.Hora_Salida
                                  ? new Date(ruta.Hora_Salida).toISOString().slice(0, 16)
                                  : "",
                                Hora_Entrada: ruta.Hora_Entrada
                                  ? new Date(ruta.Hora_Entrada).toISOString().slice(0, 16)
                                  : "",
                                Id_usuario: ruta.Id_usuario,
                              });
                              setMostrarAgregarRuta(true);
                            }}
                            className="btn-editar"
                          >
                            ✏️ Editar
                          </button>
                          {empleadosAsignados.length > 0 && (
                            <button
                              onClick={() => {
                                navigate(`/mapa-ruta?rutaId=${ruta.Id_ruta}`);
                              }}
                              className="btn-ver-mapa"
                            >
                              🗺️ Ver Mapa/Ruta
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {vistaActiva === "pasajeros" && (
            <div className="pasajeros-view">
              <h2>Empleados Registrados con Direcciones</h2>
              {empleados.length === 0 ? (
                <p>No hay empleados registrados con direcciones.</p>
              ) : (
                <div className="empleados-list">
                  {empleados.map((empleado) => (
                    <div key={empleado.id_usuario} className="empleado-card">
                      <h4>{empleado.Nom_completo}</h4>
                      <p>
                        <strong>Tipo:</strong> {empleado.Tip_usuario}
                      </p>
                      <p>
                        <strong>📍 Dirección:</strong> {empleado.direccion}
                      </p>
                      <p>
                        <strong>📞 Teléfono:</strong> {empleado.Telefono}
                      </p>
                      <p>
                        <strong>✉️ Email:</strong> {empleado.Correo}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {vistaActiva === "solicitudes" && (
            <div className="solicitudes-view">
              <div className="section-header">
                <h2>Solicitudes Pendientes de Rutas</h2>
                <button
                  onClick={cargarSolicitudesPendientes}
                  className="btn-secondary"
                >
                  🔄 Actualizar
                </button>
              </div>
              {solicitudesPendientes.length === 0 ? (
                <p className="empty-state">
                  No hay solicitudes pendientes en este momento.
                </p>
              ) : (
                <div className="solicitudes-list">
                  {solicitudesPendientes.map((solicitud) => (
                    <div key={solicitud.Id_solicitud} className="solicitud-card">
                      <div className="solicitud-header">
                        <h4>
                          Solicitud #{solicitud.Id_solicitud} -{" "}
                          {solicitud.usuario?.Nom_completo}
                        </h4>
                        <span className="estado-badge estado-pendiente">
                          {solicitud.Estado}
                        </span>
                      </div>
                      <div className="solicitud-info">
                        <p>
                          <strong>👤 Empleado:</strong>{" "}
                          {solicitud.usuario?.Nom_completo}
                        </p>
                        <p>
                          <strong>📍 Dirección:</strong> {solicitud.Direccion}
                        </p>
                        {solicitud.usuario?.Telefono && (
                          <p>
                            <strong>📞 Teléfono:</strong>{" "}
                            {solicitud.usuario.Telefono}
                          </p>
                        )}
                        {solicitud.usuario?.Correo && (
                          <p>
                            <strong>✉️ Email:</strong>{" "}
                            {solicitud.usuario.Correo}
                          </p>
                        )}
                        {solicitud.Hora_Salida && (
                          <p>
                            <strong>⏰ Hora Salida Solicitada:</strong>{" "}
                            {new Date(
                              solicitud.Hora_Salida
                            ).toLocaleString()}
                          </p>
                        )}
                        {solicitud.Hora_Entrada && (
                          <p>
                            <strong>⏰ Hora Entrada Solicitada:</strong>{" "}
                            {new Date(
                              solicitud.Hora_Entrada
                            ).toLocaleString()}
                          </p>
                        )}
                        <p>
                          <strong>📅 Fecha Solicitud:</strong>{" "}
                          {new Date(
                            solicitud.FechaSolicitud
                          ).toLocaleString()}
                        </p>
                        {solicitud.Observaciones && (
                          <p>
                            <strong>📝 Observaciones:</strong>{" "}
                            {solicitud.Observaciones}
                          </p>
                        )}
                      </div>
                      <div className="solicitud-actions">
                        <button
                          onClick={() => abrirModalAceptar(solicitud)}
                          disabled={loading}
                          className="btn-aceptar"
                        >
                          ✅ Aceptar Solicitud
                        </button>
                        <button
                          onClick={() => rechazarSolicitud(solicitud.Id_solicitud)}
                          disabled={loading}
                          className="btn-rechazar"
                        >
                          ❌ Rechazar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {mostrarAgregarRuta && (
        <div
          className="modal-overlay"
          onClick={() => {
            setMostrarAgregarRuta(false);
            setRutaEditando(null);
          }}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{rutaEditando ? "Editar Ruta" : "Agregar Nueva Ruta"}</h3>
            <div className="form-group">
              <label>Placas del Vehículo *</label>
              <input
                type="text"
                value={datosRuta.Placas}
                onChange={(e) =>
                  setDatosRuta({ ...datosRuta, Placas: e.target.value })
                }
                placeholder="Ej. ABC123"
                className="input-field"
                required
              />
            </div>
            <div className="form-group">
              <label>Marca del Vehículo</label>
              <input
                type="text"
                value={datosRuta.Marca}
                onChange={(e) =>
                  setDatosRuta({ ...datosRuta, Marca: e.target.value })
                }
                placeholder="Ej. Toyota, Chevrolet, etc."
                className="input-field"
              />
            </div>
            <div className="form-group">
              <label>Capacidad (Número de Puestos) *</label>
              <input
                type="number"
                min="1"
                value={datosRuta.Capacidad}
                onChange={(e) =>
                  setDatosRuta({ ...datosRuta, Capacidad: parseInt(e.target.value) || 20 })
                }
                placeholder="Ej. 20"
                className="input-field"
                required
              />
            </div>
            <div className="form-group">
              <label>Papeles del Vehículo</label>
              <select
                value={datosRuta.Papeles_Vehiculo}
                onChange={(e) =>
                  setDatosRuta({ ...datosRuta, Papeles_Vehiculo: e.target.value })
                }
                className="input-field"
              >
                <option value="">Seleccione estado...</option>
                <option value="Al día">Al día</option>
                <option value="Pendiente renovación">Pendiente renovación</option>
                <option value="Vencidos">Vencidos</option>
                <option value="En trámite">En trámite</option>
              </select>
            </div>
            <div className="form-group">
              <label>Hora de Salida</label>
              <input
                type="datetime-local"
                value={datosRuta.Hora_Salida}
                onChange={(e) =>
                  setDatosRuta({ ...datosRuta, Hora_Salida: e.target.value })
                }
                className="input-field"
              />
            </div>
            <div className="form-group">
              <label>Hora de Entrada</label>
              <input
                type="datetime-local"
                value={datosRuta.Hora_Entrada}
                onChange={(e) =>
                  setDatosRuta({ ...datosRuta, Hora_Entrada: e.target.value })
                }
                className="input-field"
              />
            </div>
            <div className="modal-actions">
              <button
                onClick={() => {
                  setMostrarAgregarRuta(false);
                  setRutaEditando(null);
                }}
                className="btn-secondary"
              >
                Cancelar
              </button>
              <button
                onClick={agregarRuta}
                disabled={loading}
                className="btn-primary"
              >
                {loading
                  ? rutaEditando
                    ? "Actualizando..."
                    : "Agregando..."
                  : rutaEditando
                  ? "Actualizar Ruta"
                  : "Agregar Ruta"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Aceptar Solicitud */}
      {mostrarModalAceptar && solicitudSeleccionada && (
        <div
          className="modal-overlay"
          onClick={() => {
            setMostrarModalAceptar(false);
            setSolicitudSeleccionada(null);
            setDatosAceptar({ placas: "", marca: "", capacidad: 20, papelesVehiculo: "", direccionEncuentro: "" });
          }}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Aceptar Solicitud de Ruta</h3>
            <p className="modal-subtitle">
              Complete los datos del vehículo para esta ruta:
            </p>
            
            <div className="form-group">
              <label>Placas del Vehículo *</label>
              <input
                type="text"
                value={datosAceptar.placas}
                onChange={(e) =>
                  setDatosAceptar({ ...datosAceptar, placas: e.target.value })
                }
                placeholder="Ej. ABC123"
                className="input-field"
                required
              />
            </div>

            <div className="form-group">
              <label>Marca del Vehículo</label>
              <input
                type="text"
                value={datosAceptar.marca}
                onChange={(e) =>
                  setDatosAceptar({ ...datosAceptar, marca: e.target.value })
                }
                placeholder="Ej. Toyota, Chevrolet, etc."
                className="input-field"
              />
            </div>

            <div className="form-group">
              <label>Capacidad (Número de Puestos) *</label>
              <input
                type="number"
                min="1"
                value={datosAceptar.capacidad}
                onChange={(e) =>
                  setDatosAceptar({ ...datosAceptar, capacidad: parseInt(e.target.value) || 20 })
                }
                placeholder="Ej. 20"
                className="input-field"
                required
              />
            </div>

            <div className="form-group">
              <label>Papeles del Vehículo</label>
              <select
                value={datosAceptar.papelesVehiculo}
                onChange={(e) =>
                  setDatosAceptar({ ...datosAceptar, papelesVehiculo: e.target.value })
                }
                className="input-field"
              >
                <option value="">Seleccione estado...</option>
                <option value="Al día">Al día</option>
                <option value="Pendiente renovación">Pendiente renovación</option>
                <option value="Vencidos">Vencidos</option>
                <option value="En trámite">En trámite</option>
              </select>
            </div>

            <div className="form-group">
              <label>Dirección de Encuentro *</label>
              <input
                type="text"
                value={datosAceptar.direccionEncuentro}
                onChange={(e) =>
                  setDatosAceptar({
                    ...datosAceptar,
                    direccionEncuentro: e.target.value,
                  })
                }
                placeholder="Dirección donde se encontrará con el empleado"
                className="input-field"
                required
              />
            </div>

            <div className="modal-actions">
              <button
                onClick={() => {
                  setMostrarModalAceptar(false);
                  setSolicitudSeleccionada(null);
                  setDatosAceptar({ placas: "", marca: "", capacidad: 20, papelesVehiculo: "", direccionEncuentro: "" });
                }}
                className="btn-secondary"
              >
                Cancelar
              </button>
              <button
                onClick={aceptarSolicitud}
                disabled={loading || !datosAceptar.placas.trim() || !datosAceptar.direccionEncuentro.trim()}
                className="btn-primary"
              >
                {loading ? "Aceptando..." : "✅ Aceptar Solicitud"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal del Mapa/Ruta */}
      {mostrarMapa && (
        <div
          className="modal-overlay"
          onClick={() => {
            setMostrarMapa(false);
            setEmpleadosEnRuta([]);
            setRutaSeleccionadaMapa(null);
          }}
        >
          <div className="modal-content modal-mapa" onClick={(e) => e.stopPropagation()}>
            <div className="mapa-header">
              <h3>🗺️ Ruta de Recolección</h3>
              <button
                className="btn-cerrar-mapa"
                onClick={() => {
                  setMostrarMapa(false);
                  setEmpleadosEnRuta([]);
                  setRutaSeleccionadaMapa(null);
                }}
              >
                ✕
              </button>
            </div>
            <div className="mapa-container">
              <div className="mapa-direcciones-wrapper">
                <div className="mapa-direcciones">
                <div className="direcciones-seccion">
                  <h4>📍 Recoger:</h4>
                  <ol className="lista-direcciones">
                    {empleadosEnRuta.map((empleado, index) => (
                      <li key={empleado.id_usuario} className="direccion-item">
                        <div className="direccion-numero">{index + 1}</div>
                        <div className="direccion-info">
                          <strong>{empleado.Nom_completo}</strong>
                          <p>{empleado.direccion}</p>
                          {empleado.Telefono && (
                            <p className="telefono">📞 {empleado.Telefono}</p>
                          )}
                        </div>
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                            empleado.direccion
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-mapa-link"
                        >
                          📍 Abrir en Maps
                        </a>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="direcciones-seccion destino-seccion">
                  <h4>🚚 Llevar:</h4>
                  {rutaSeleccionadaMapa?.Direccion_Encuentro ? (
                    <div className="direccion-item destino-item">
                      <div className="direccion-numero destino-numero">🏁</div>
                      <div className="direccion-info">
                        <strong>Destino Final</strong>
                        <p>{rutaSeleccionadaMapa.Direccion_Encuentro}</p>
                      </div>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                          rutaSeleccionadaMapa.Direccion_Encuentro
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-mapa-link"
                      >
                        📍 Abrir en Maps
                      </a>
                    </div>
                  ) : (
                    <div className="direccion-item destino-item destino-vacio">
                      <div className="direccion-numero destino-numero">🏁</div>
                      <div className="direccion-info">
                        <strong>Destino Final</strong>
                        <p style={{ color: '#999', fontStyle: 'italic' }}>
                          No se ha definido un destino para esta ruta. 
                          Puedes editarla desde "Mis Rutas" para agregar una dirección de encuentro.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              </div>
              <div className="mapa-iframe-container">
                {empleadosEnRuta.length > 0 ? (
                  <div className="mapa-simple">
                    <div className="mapa-simple-info">
                      <h4>Ruta con {empleadosEnRuta.length} parada{empleadosEnRuta.length !== 1 ? 's' : ''}</h4>
                      {rutaSeleccionadaMapa?.Direccion_Encuentro && (
                        <p className="destino-info">
                          <strong>Destino:</strong> {rutaSeleccionadaMapa.Direccion_Encuentro}
                        </p>
                      )}
                      <a
                        href={`https://www.google.com/maps/dir/${empleadosEnRuta
                          .map((e) => encodeURIComponent(e.direccion || ""))
                          .filter(Boolean)
                          .join("/")}${rutaSeleccionadaMapa?.Direccion_Encuentro ? "/" + encodeURIComponent(rutaSeleccionadaMapa.Direccion_Encuentro) : ""}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-abrir-maps-completo"
                      >
                        🗺️ Abrir Ruta Completa en Google Maps
                      </a>
                    </div>
                    <p className="mapa-nota">
                      💡 Haz clic en "Abrir en Maps" en cada dirección para obtener indicaciones detalladas desde Google Maps.
                    </p>
                  </div>
                ) : (
                  <div className="mapa-vacio">
                    <div className="mapa-vacio-icono">🚫</div>
                    <p>No hay empleados asignados a esta ruta aún.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

