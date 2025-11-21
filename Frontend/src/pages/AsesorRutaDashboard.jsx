import React, { useState, useEffect } from "react";
import "../styles/AsesorRutaDashboard.css";
import { getUser, removeUser } from "../utils/auth";
import { asesorService, rutasService } from "../services/api";
import Breadcrumbs from "../components/Breadcrumbs";

export default function AsesorRutaDashboard() {
  const [usuario, setUsuario] = useState(null);
  const [vistaActiva, setVistaActiva] = useState("dashboard");
  const [rutas, setRutas] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [conductores, setConductores] = useState([]);
  const [rutaSeleccionada, setRutaSeleccionada] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mostrarAgregarRuta, setMostrarAgregarRuta] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [datosRuta, setDatosRuta] = useState({
    Placas: "",
    Marca: "",
    Capacidad: 20,
    Papeles_Vehiculo: "",
    Direccion_Encuentro: "",
    Hora_Salida: "",
    Hora_Entrada: "",
    Id_conductor: null,
  });

  useEffect(() => {
    const usuarioData = getUser();
    if (usuarioData) {
      setUsuario(usuarioData);
      cargarRutas();
      cargarEmpleados();
      cargarConductores();
    }
  }, []);

  const cargarConductores = async () => {
    try {
      const result = await asesorService.obtenerEmpleados();
      if (Array.isArray(result)) {
        setConductores(result.filter(u => u.Tip_usuario === 'Conductor'));
      } else if (result.data) {
        setConductores(result.data.filter(u => u.Tip_usuario === 'Conductor'));
      }
    } catch (error) {
      console.error("Error al cargar conductores:", error);
    }
  };

  const cargarRutas = async () => {
    setLoading(true);
    try {
      const result = await asesorService.obtenerRutasConParadas();
      if (Array.isArray(result)) {
        setRutas(result);
      } else if (result.exito && result.data) {
        setRutas(result.data);
      } else if (result.data) {
        setRutas(result.data);
      } else {
        setRutas(result);
      }
    } catch (error) {
      console.error("Error al cargar rutas:", error);
    } finally {
      setLoading(false);
    }
  };

  const cargarEmpleados = async () => {
    try {
      const result = await asesorService.obtenerEmpleados();
      if (Array.isArray(result)) {
        setEmpleados(result.filter(u => u.Tip_usuario === 'Empleado'));
      }
    } catch (error) {
      console.error("Error al cargar empleados:", error);
    }
  };

  const verDetallesRuta = async (idRuta) => {
    setLoading(true);
    try {
      const result = await asesorService.obtenerRutaDetalles(idRuta);
      if (result.exito) {
        setRutaSeleccionada(result.data);
        setVistaActiva("detalles");
      }
    } catch (error) {
      console.error("Error al cargar detalles:", error);
    } finally {
      setLoading(false);
    }
  };

  const cerrarSesion = async () => {
    const { logout } = await import("../utils/auth");
    await logout();
    window.location.href = "/iniciarsesion";
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
        Direccion_Encuentro: datosRuta.Direccion_Encuentro || null,
        Id_conductor: datosRuta.Id_conductor ? parseInt(datosRuta.Id_conductor) : null,
        Hora_Salida: datosRuta.Hora_Salida
          ? new Date(datosRuta.Hora_Salida).toISOString()
          : new Date().toISOString(),
        Hora_Entrada: datosRuta.Hora_Entrada
          ? new Date(datosRuta.Hora_Entrada).toISOString()
          : new Date().toISOString(),
      };

      const result = await rutasService.create(datosRutaCompletos);
      
      if (result) {
        setMensaje("✅ Ruta agregada correctamente");
        setDatosRuta({
          Placas: "",
          Marca: "",
          Capacidad: 20,
          Papeles_Vehiculo: "",
          Direccion_Encuentro: "",
          Hora_Salida: "",
          Hora_Entrada: "",
          Id_conductor: null,
        });
        setMostrarAgregarRuta(false);
        cargarRutas();
      }
    } catch (error) {
      setMensaje(`❌ Error al agregar la ruta: ${error.message}`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="asesor-dashboard">
      <nav className="asesor-nav">
        <div className="asesor-logo">
          <img src="/img/Logo.png" alt="Logo" />
          <span>Travel Safely - Asesor de Ruta</span>
        </div>
        <div className="asesor-user">
          <span>Hola, {usuario?.Nom_completo}</span>
          <button onClick={cerrarSesion} className="btn-cerrar-sesion">
            Cerrar Sesión
          </button>
        </div>
      </nav>

      <Breadcrumbs />

      <div className="asesor-content">
        <div className="asesor-sidebar">
          <button
            className={vistaActiva === "dashboard" ? "active" : ""}
            onClick={() => {
              setVistaActiva("dashboard");
              setRutaSeleccionada(null);
            }}
          >
            🏠 Dashboard
          </button>
          <button
            className={vistaActiva === "rutas" ? "active" : ""}
            onClick={() => {
              setVistaActiva("rutas");
              setRutaSeleccionada(null);
            }}
          >
            🚌 Rutas Disponibles
          </button>
          <button
            className={vistaActiva === "empleados" ? "active" : ""}
            onClick={() => setVistaActiva("empleados")}
          >
            👥 Empleados
          </button>
        </div>

        <div className="asesor-main">
          {vistaActiva === "dashboard" && (
            <div className="dashboard-view">
              <h1>Bienvenido, {usuario?.Nom_completo}</h1>
              <div className="dashboard-cards">
                <div className="dashboard-card">
                  <h3>🚌 Rutas Disponibles</h3>
                  <p>{rutas.length} ruta(s) en el sistema</p>
                  <button onClick={() => setVistaActiva("rutas")}>
                    Ver Rutas
                  </button>
                </div>
                <div className="dashboard-card">
                  <h3>👥 Empleados</h3>
                  <p>Ver información de empleados</p>
                  <button onClick={() => setVistaActiva("empleados")}>
                    Ver Empleados
                  </button>
                </div>
              </div>
            </div>
          )}

          {vistaActiva === "rutas" && (
            <div className="rutas-view">
              <div className="rutas-header-section">
                <h2>Rutas Disponibles</h2>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <span className="badge">
                    Total Rutas: {rutas.length}
                  </span>
                  <button
                    onClick={() => setMostrarAgregarRuta(true)}
                    className="btn-agregar-ruta"
                  >
                    ➕ Agregar Ruta
                  </button>
                </div>
              </div>
              {mensaje && (
                <div className={`mensaje-asesor ${mensaje.includes("✅") ? "exito" : "error"}`}>
                  <span>{mensaje}</span>
                  <button onClick={() => setMensaje("")} title="Cerrar">
                    ✕
                  </button>
                </div>
              )}
              {loading ? (
                <p>Cargando rutas...</p>
              ) : rutas.length === 0 ? (
                <p>No hay rutas disponibles en el sistema.</p>
              ) : (
                <div className="rutas-list" style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                  gap: '1.5rem'
                }}>
                  {rutas.map((ruta) => {
                    const empleadosAsignados = ruta.ruta_empleado?.map(re => re.usuario).filter(Boolean) || [];
                    const capacidad = ruta.Capacidad || 20;
                    const disponibles = capacidad - empleadosAsignados.length;
                    const estado = disponibles === 0 ? 'Completo' : 'Disponible';
                    const direccionEncuentro = ruta.Direccion_Encuentro || 'Sin dirección';
                    
                    return (
                      <div key={ruta.Id_ruta} className="ruta-card">
                        <div className={`ruta-header-card ${estado === 'Completo' ? 'completo' : ''}`}>
                          <div className="ruta-location">
                            <span className="location-icon">📍</span>
                            <strong>{direccionEncuentro}</strong>
                          </div>
                          <span className={`ruta-status ${estado === 'Completo' ? 'completo' : ''}`}>
                            {estado}
                          </span>
                        </div>
                        
                        <div className="ruta-info-card">
                          <p>
                            <span className="icon">👤</span>
                            <strong>Conductor:</strong> {ruta.conductor?.Nom_completo || 'Sin asignar'}
                          </p>
                          <p>
                            <span className="icon">🚗</span>
                            <strong>Placa:</strong> {ruta.Placas}
                          </p>
                          {ruta.Marca && (
                            <p>
                              <span className="icon">🏷️</span>
                              <strong>Marca:</strong> {ruta.Marca}
                            </p>
                          )}
                          <p>
                            <span className="icon">👥</span>
                            <strong>{capacidad} Capacidad</strong>
                          </p>
                          <p style={{ 
                            color: disponibles === 0 ? '#666' : '#333',
                            borderLeftColor: disponibles === 0 ? '#999' : '#000000'
                          }}>
                            <span className="icon">{disponibles === 0 ? '🔴' : '🟢'}</span>
                            <strong>{disponibles} Disponibles</strong>
                          </p>
                        </div>

                        {empleadosAsignados.length > 0 && (
                          <div className="pasajeros-section-card">
                            <div className="pasajeros-title">Pasajeros</div>
                            <ul className="pasajeros-list">
                              {empleadosAsignados.map((empleado, idx) => (
                                <li key={empleado.id_usuario || idx}>
                                  {empleado.Nom_completo}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <button
                          onClick={() => verDetallesRuta(ruta.Id_ruta)}
                          className="btn-ver-detalles"
                        >
                          Ver Detalles Completos
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {vistaActiva === "detalles" && rutaSeleccionada && (
            <div className="detalles-view">
              <button
                onClick={() => {
                  setVistaActiva("rutas");
                  setRutaSeleccionada(null);
                }}
                className="btn-volver"
              >
                ← Volver a Rutas
              </button>
              <h2>Detalles de la Ruta #{rutaSeleccionada.Id_ruta}</h2>
              
              <div className="detalles-section">
                <h3>Información de la Ruta</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <strong>Placas:</strong> {rutaSeleccionada.Placas}
                  </div>
                  <div className="info-item">
                    <strong>Hora Salida:</strong>{" "}
                    {new Date(rutaSeleccionada.Hora_Salida).toLocaleString()}
                  </div>
                  <div className="info-item">
                    <strong>Hora Entrada:</strong>{" "}
                    {new Date(rutaSeleccionada.Hora_Entrada).toLocaleString()}
                  </div>
                </div>
              </div>

              {rutaSeleccionada.conductor && (
                <div className="detalles-section">
                  <h3>Conductor</h3>
                  <div className="info-grid">
                    <div className="info-item">
                      <strong>Nombre:</strong> {rutaSeleccionada.conductor.Nom_completo}
                    </div>
                    <div className="info-item">
                      <strong>Dirección:</strong> {rutaSeleccionada.conductor.direccion || 'No registrada'}
                    </div>
                    <div className="info-item">
                      <strong>Teléfono:</strong> {rutaSeleccionada.conductor.Telefono || 'No registrado'}
                    </div>
                    <div className="info-item">
                      <strong>Email:</strong> {rutaSeleccionada.conductor.Correo || 'No registrado'}
                    </div>
                  </div>
                </div>
              )}

              {rutaSeleccionada.ruta_empleado && rutaSeleccionada.ruta_empleado.length > 0 && (
                <div className="detalles-section">
                  <h3>Pasajeros Asignados ({rutaSeleccionada.ruta_empleado.length})</h3>
                  <div className="empleados-list" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                    gap: '1rem'
                  }}>
                    {rutaSeleccionada.ruta_empleado.map((rutaEmpleado) => {
                      const empleado = rutaEmpleado.usuario;
                      if (!empleado) return null;
                      
                      return (
                        <div key={rutaEmpleado.Id_ruta_empleado} style={{
                          background: '#f9f9f9',
                          padding: '1rem',
                          borderRadius: '6px',
                          border: '1px solid #e0e0e0'
                        }}>
                          <h4 style={{ margin: '0 0 0.5rem 0' }}>{empleado.Nom_completo}</h4>
                          <p style={{ margin: '0.3rem 0', fontSize: '0.9rem' }}>
                            <strong>📧 Email:</strong> {empleado.Correo || 'N/A'}
                          </p>
                          <p style={{ margin: '0.3rem 0', fontSize: '0.9rem' }}>
                            <strong>📞 Teléfono:</strong> {empleado.Telefono || 'N/A'}
                          </p>
                          <p style={{ margin: '0.3rem 0', fontSize: '0.9rem' }}>
                            <strong>📍 Dirección:</strong> {empleado.direccion || 'N/A'}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {rutaSeleccionada.ruta_servicio &&
                rutaSeleccionada.ruta_servicio.length > 0 && (
                  <div className="detalles-section">
                    <h3>Paradas de la Ruta</h3>
                    {rutaSeleccionada.ruta_servicio.map((rutaServicio, index) => (
                      <div key={index} className="parada-section">
                        <h4>Servicio #{rutaServicio.servicio?.Id_servicio}</h4>
                        <p>
                          <strong>Dirección del Servicio:</strong>{" "}
                          {rutaServicio.servicio?.Direccion}
                        </p>
                        {rutaServicio.servicio?.parada &&
                          rutaServicio.servicio.parada.length > 0 && (
                            <div className="paradas-list">
                              <strong>Paradas:</strong>
                              <ul>
                                {rutaServicio.servicio.parada.map((parada) => (
                                  <li key={parada.Id_parada}>
                                    {parada.Direccion}
                                    {parada.Barrio && ` - ${parada.Barrio}`}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                      </div>
                    ))}
                  </div>
                )}
            </div>
          )}

          {vistaActiva === "empleados" && (
            <div className="empleados-view">
              <h2>Empleados del Sistema</h2>
              <p style={{ marginBottom: '1.5rem', color: '#666' }}>
                Lista de todos los empleados registrados en el sistema. Los empleados que están asignados a rutas aparecen como pasajeros en la sección "Rutas Disponibles".
              </p>
              
              {empleados.length === 0 ? (
                <div className="info-box" style={{
                  background: '#f9f9f9',
                  padding: '2rem',
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <p>No hay empleados registrados en el sistema.</p>
                </div>
              ) : (
                <div className="empleados-grid" style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                  gap: '1.5rem'
                }}>
                  {empleados.map((empleado) => {
                    // Verificar si el empleado está asignado a alguna ruta
                    const rutaAsignada = rutas.find(r => 
                      r.ruta_empleado?.some(re => re.usuario?.id_usuario === empleado.id_usuario)
                    );
                    
                    return (
                      <div key={empleado.id_usuario} className="empleado-card" style={{
                        background: '#fff',
                        border: '1px solid #e0e0e0',
                        borderRadius: '8px',
                        padding: '1.5rem',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }}>
                        <div style={{ marginBottom: '1rem' }}>
                          <h4 style={{ margin: '0 0 0.5rem 0', color: '#2c3e50' }}>
                            {empleado.Nom_completo}
                          </h4>
                          {rutaAsignada && (
                            <span style={{
                              background: '#27ae60',
                              color: '#fff',
                              padding: '0.3rem 0.6rem',
                              borderRadius: '4px',
                              fontSize: '0.8rem',
                              display: 'inline-block',
                              marginBottom: '0.5rem'
                            }}>
                              ✓ Asignado a Ruta
                            </span>
                          )}
                        </div>
                        
                        <div className="empleado-info">
                          <p style={{ margin: '0.5rem 0' }}>
                            <strong>📧 Email:</strong> {empleado.Correo || 'No registrado'}
                          </p>
                          <p style={{ margin: '0.5rem 0' }}>
                            <strong>📞 Teléfono:</strong> {empleado.Telefono || 'No registrado'}
                          </p>
                          <p style={{ margin: '0.5rem 0' }}>
                            <strong>📍 Dirección:</strong> {empleado.direccion || 'No registrada'}
                          </p>
                          {rutaAsignada && (
                            <div style={{
                              marginTop: '1rem',
                              padding: '0.75rem',
                              background: '#ecf0f1',
                              borderRadius: '4px',
                              fontSize: '0.9rem'
                            }}>
                              <strong>Ruta asignada:</strong> {rutaAsignada.Direccion_Encuentro || `Ruta #${rutaAsignada.Id_ruta}`}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              
              <div className="info-box" style={{
                background: '#e8f4f8',
                padding: '1rem',
                borderRadius: '8px',
                marginTop: '2rem',
                borderLeft: '4px solid #3498db'
              }}>
                <p style={{ margin: 0 }}>
                  <strong>💡 Nota:</strong> Para ver empleados asignados a rutas específicas con sus detalles de conductor y vehículo, navega a "Rutas Disponibles".
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal para Agregar Ruta */}
      {mostrarAgregarRuta && (
        <div
          className="modal-overlay"
          onClick={() => {
            setMostrarAgregarRuta(false);
            setDatosRuta({
              Placas: "",
              Marca: "",
              Capacidad: 20,
              Papeles_Vehiculo: "",
              Direccion_Encuentro: "",
              Hora_Salida: "",
              Hora_Entrada: "",
              Id_conductor: null,
            });
          }}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3>Agregar Nueva Ruta</h3>
              <button
                className="btn-cerrar"
                onClick={() => {
                  setMostrarAgregarRuta(false);
                  setDatosRuta({
                    Placas: "",
                    Marca: "",
                    Capacidad: 20,
                    Papeles_Vehiculo: "",
                    Direccion_Encuentro: "",
                    Hora_Salida: "",
                    Hora_Entrada: "",
                    Id_conductor: null,
                  });
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#999',
                  padding: 0,
                  width: '30px',
                  height: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label>Placas del Vehículo *</label>
              <input
                type="text"
                value={datosRuta.Placas}
                onChange={(e) => setDatosRuta({ ...datosRuta, Placas: e.target.value })}
                placeholder="Ej. ABC123"
                required
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label>Marca del Vehículo</label>
              <input
                type="text"
                value={datosRuta.Marca}
                onChange={(e) => setDatosRuta({ ...datosRuta, Marca: e.target.value })}
                placeholder="Ej. Toyota, Chevrolet, etc."
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label>Capacidad (Número de Puestos) *</label>
              <input
                type="number"
                min="1"
                value={datosRuta.Capacidad}
                onChange={(e) => setDatosRuta({ ...datosRuta, Capacidad: parseInt(e.target.value) || 20 })}
                placeholder="Ej. 20"
                required
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label>Dirección de Encuentro</label>
              <input
                type="text"
                value={datosRuta.Direccion_Encuentro}
                onChange={(e) => setDatosRuta({ ...datosRuta, Direccion_Encuentro: e.target.value })}
                placeholder="Dirección donde se recogerá a los empleados"
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label>Conductor (Opcional)</label>
              <select
                value={datosRuta.Id_conductor || ""}
                onChange={(e) => setDatosRuta({ ...datosRuta, Id_conductor: e.target.value ? parseInt(e.target.value) : null })}
              >
                <option value="">Seleccione un conductor...</option>
                {conductores.map((conductor) => (
                  <option key={conductor.id_usuario} value={conductor.id_usuario}>
                    {conductor.Nom_completo} - {conductor.Correo || conductor.Telefono}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label>Papeles del Vehículo</label>
              <select
                value={datosRuta.Papeles_Vehiculo}
                onChange={(e) => setDatosRuta({ ...datosRuta, Papeles_Vehiculo: e.target.value })}
              >
                <option value="">Seleccione estado...</option>
                <option value="Al día">Al día</option>
                <option value="Pendiente renovación">Pendiente renovación</option>
                <option value="Vencidos">Vencidos</option>
              </select>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="btn-cancelar"
                onClick={() => {
                  setMostrarAgregarRuta(false);
                  setDatosRuta({
                    Placas: "",
                    Marca: "",
                    Capacidad: 20,
                    Papeles_Vehiculo: "",
                    Direccion_Encuentro: "",
                    Hora_Salida: "",
                    Hora_Entrada: "",
                    Id_conductor: null,
                  });
                }}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn-submit"
                onClick={agregarRuta}
                disabled={loading || !datosRuta.Placas.trim()}
              >
                {loading ? "Agregando..." : "✅ Agregar Ruta"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

