import React, { useState, useEffect } from "react";
import "../styles/AdminDashboard.css";
import FormularioModal from "../components/FormularioModal";
import { usuariosService, rutasService, empresasService } from "../services/api";
import { getUser, removeUser } from "../utils/auth";
import Breadcrumbs from "../components/Breadcrumbs";
import DataTable from "../components/DataTable";

export default function AdminDashboard() {
  const [usuario, setUsuario] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [rutas, setRutas] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [vistaActiva, setVistaActiva] = useState("dashboard");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [formularioEdicion, setFormularioEdicion] = useState(null);
  const [nuevoItem, setNuevoItem] = useState({
    tipo: "",
    datos: {},
  });

  useEffect(() => {
    // Obtener datos del usuario desde localStorage
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

  const obtenerUsuarios = async () => {
    try {
      const data = await usuariosService.getAll();
      setUsuarios(data);
    } catch (err) {
      console.error("Error al obtener usuarios:", err);
    }
  };

  const obtenerRutas = async () => {
    try {
      const data = await rutasService.getAll();
      setRutas(data);
    } catch (err) {
      console.error("Error al obtener rutas:", err);
    }
  };

  const obtenerEmpresas = async () => {
    try {
      const data = await empresasService.getAll();
      setEmpresas(data);
    } catch (err) {
      console.error("Error al obtener empresas:", err);
    }
  };

  const eliminarItem = async (tipo, id) => {
    try {
      let data;
      if (tipo === "usuarios") {
        data = await usuariosService.delete(id);
      } else if (tipo === "ruta") {
        data = await rutasService.delete(id);
      } else if (tipo === "empresa") {
        data = await empresasService.delete(id);
      }

      if (data.exito !== false) {
        // Recargar datos
        if (tipo === "usuarios") obtenerUsuarios();
        if (tipo === "ruta") obtenerRutas();
        if (tipo === "empresa") obtenerEmpresas();
        alert("Elemento eliminado correctamente");
      } else {
        alert("Error al eliminar: " + data.mensaje);
      }
    } catch (err) {
      console.error("Error al eliminar:", err);
      alert("Error al eliminar el elemento");
    }
  };

  const editarItem = (tipo, item) => {
    setFormularioEdicion({ tipo, item });
    setMostrarFormulario(true);
  };

  const crearItem = (tipo) => {
    setNuevoItem({ tipo, datos: {} });
    setFormularioEdicion(null);
    setMostrarFormulario(true);
  };

  const handleSave = () => {
    // Recargar datos después de guardar
    obtenerUsuarios();
    obtenerRutas();
    obtenerEmpresas();
  };

  useEffect(() => {
    obtenerUsuarios();
    obtenerRutas();
    obtenerEmpresas();
  }, []);

  // Inicializar con rutas como vista por defecto
  useEffect(() => {
    if (vistaActiva === "dashboard") {
      setVistaActiva("rutas");
    }
  }, []);

  return (
    <div className="admin-dashboard">
      <nav className="admin-nav">
        <div className="admin-logo">
          <div className="logo-square">MY</div>
          <div className="admin-title-group">
            <h1>Administrador</h1>
            <span className="admin-subtitle">Travel Safely - Gestión Empresarial</span>
          </div>
        </div>
        <div className="admin-user">
          <span>Bienvenido, {usuario?.Nom_completo}</span>
          <button onClick={cerrarSesion} className="btn-cerrar-sesion">
            Cerrar Sesión
          </button>
        </div>
      </nav>

      <Breadcrumbs />

      {/* Barra de navegación con pestañas */}
      <div className="admin-tabs">
        <button
          className={`admin-tab ${vistaActiva === "rutas" ? "active" : ""}`}
          onClick={() => setVistaActiva("rutas")}
        >
          <span className="tab-icon">🔗</span>
          Rutas Disponibles
        </button>
        <button
          className={`admin-tab ${vistaActiva === "asignar" ? "active" : ""}`}
          onClick={() => setVistaActiva("asignar")}
        >
          <span className="tab-icon">🚗</span>
          Asignar Ruta
        </button>
        <button
          className={`admin-tab ${vistaActiva === "usuarios" ? "active" : ""}`}
          onClick={() => setVistaActiva("usuarios")}
        >
          <span className="tab-icon">👤</span>
          Registrar Usuario
        </button>
      </div>

      <div className="admin-content">

        {/* Vista de Usuarios / Registrar Usuario */}
        {vistaActiva === "usuarios" && (
          <div className="gestion-section">
            <div className="section-header">
              <h2>Registrar Usuario</h2>
              <button
                onClick={() => crearItem("usuarios")}
                className="btn-crear"
              >
                + Registrar Nuevo Usuario
              </button>
            </div>
            <DataTable
              data={usuarios}
              columns={[
                {
                  key: 'Nom_completo',
                  header: 'Nombre Completo',
                  sortable: true,
                },
                {
                  key: 'Tip_usuario',
                  header: 'Tipo de Usuario',
                  sortable: true,
                },
                {
                  key: 'Correo',
                  header: 'Email',
                  sortable: true,
                },
                {
                  key: 'Telefono',
                  header: 'Teléfono',
                  sortable: true,
                },
                {
                  key: 'direccion',
                  header: 'Dirección',
                  sortable: true,
                },
                {
                  key: 'actions',
                  header: 'Acciones',
                  sortable: false,
                  filterable: false,
                  render: (user) => (
                    <div className="item-actions" style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          editarItem("usuarios", user);
                        }}
                        className="btn-editar"
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                      >
                        Editar
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          eliminarItem("usuarios", user.id_usuario);
                        }}
                        className="btn-eliminar"
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                      >
                        Eliminar
                      </button>
                    </div>
                  ),
                },
              ]}
              itemsPerPage={10}
              searchable={true}
              sortable={true}
              filterable={true}
              emptyMessage="No hay usuarios registrados"
            />
          </div>
        )}

        {/* Vista de Rutas */}
        {vistaActiva === "rutas" && (
          <div className="rutas-disponibles-section">
            <div className="rutas-header-section">
              <h2>Rutas Disponibles</h2>
              <span className="total-rutas-badge">Total Rutas: {rutas.length}</span>
            </div>
            <div className="rutas-grid-admin">
              {rutas.map((ruta) => {
                const empleadosAsignados = ruta.ruta_empleado?.map(re => re.usuario).filter(Boolean) || [];
                const capacidad = ruta.Capacidad || 20;
                const disponibles = capacidad - empleadosAsignados.length;
                const estado = disponibles === 0 ? 'Completo' : 'Disponible';
                const direccionEncuentro = ruta.Direccion_Encuentro || 'Sin dirección';
                
                return (
                  <div key={ruta.Id_ruta} className="ruta-card-admin">
                    <div className="ruta-header-card">
                      <div className="ruta-location">
                        <span className="location-icon">📍</span>
                        <strong>{direccionEncuentro}</strong>
                      </div>
                      <button className={`ruta-status ${estado.toLowerCase()}`}>
                        {estado}
                      </button>
                    </div>
                    
                    <div className="ruta-info-card">
                      <p className="ruta-info-item">
                        <span className="info-label">👤 Conductor:</span> {ruta.conductor?.Nom_completo || 'Sin asignar'}
                      </p>
                      <p className="ruta-info-item">
                        <span className="info-label">🚗 Placa:</span> {ruta.Placas}
                      </p>
                      <p className="ruta-info-item">
                        <span className="info-label">{capacidad} Capacidad</span>
                      </p>
                      <p className={`ruta-info-item disponibles ${disponibles === 0 ? 'completo' : 'disponible'}`}>
                        <span className="info-label">{disponibles} Disponibles</span>
                      </p>
                    </div>

                    {empleadosAsignados.length > 0 && (
                      <div className="pasajeros-section-card">
                        <strong className="pasajeros-title">Pasajeros:</strong>
                        <ul className="pasajeros-list">
                          {empleadosAsignados.map((empleado, idx) => (
                            <li key={empleado.id_usuario || idx}>
                              • {empleado.Nom_completo}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Vista de Asignar Ruta */}
        {vistaActiva === "asignar" && (
          <div className="gestion-section">
            <div className="section-header">
              <h2>Asignar Ruta</h2>
              <button onClick={() => crearItem("ruta")} className="btn-crear">
                + Crear Nueva Ruta
              </button>
            </div>
            <p style={{ color: '#666', marginTop: '1rem' }}>
              Aquí puedes asignar empleados a rutas existentes o crear nuevas rutas.
            </p>
          </div>
        )}

        {/* Vista de Empresas */}
        {vistaActiva === "empresas" && (
          <div className="gestion-section">
            <div className="section-header">
              <h2>Gestión de Empresas</h2>
              <button
                onClick={() => crearItem("empresa")}
                className="btn-crear"
              >
                + Crear Empresa
              </button>
            </div>
            <div className="items-grid">
              {empresas.map((empresa) => (
                <div key={empresa.id_empresa} className="item-card">
                  <h4>{empresa.Nom_empresa}</h4>
                  <p>
                    <strong>Tipo:</strong> {empresa.Tip_empresa}
                  </p>
                  <p>
                    <strong>Dirección:</strong> {empresa.Direccion}
                  </p>
                  <p>
                    <strong>Email:</strong> {empresa.Correo}
                  </p>
                  <div className="item-actions">
                    <button
                      onClick={() => editarItem("empresa", empresa)}
                      className="btn-editar"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() =>
                        eliminarItem("empresa", empresa.id_empresa)
                      }
                      className="btn-eliminar"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Vista de Reportes */}
        {vistaActiva === "reportes" && (
          <div className="gestion-section">
            <h2>Reportes y Estadísticas</h2>
            <div className="reportes-grid">
              <div className="reporte-card">
                <h3>Total de Usuarios</h3>
                <p className="numero-grande">{usuarios.length}</p>
              </div>
              <div className="reporte-card">
                <h3>Total de Rutas</h3>
                <p className="numero-grande">{rutas.length}</p>
              </div>
              <div className="reporte-card">
                <h3>Total de Empresas</h3>
                <p className="numero-grande">{empresas.length}</p>
              </div>
              <div className="reporte-card">
                <h3>Usuarios por Tipo</h3>
                <p>
                  Administradores:{" "}
                  {
                    usuarios.filter((u) => u.Tip_usuario === "Administrador")
                      .length
                  }
                </p>
                <p>
                  Empleados:{" "}
                  {usuarios.filter((u) => u.Tip_usuario === "Empleado").length}
                </p>
              </div>
            </div>
          </div>
        )}


        {/* Modal para crear/editar elementos */}
        <FormularioModal
          isOpen={mostrarFormulario}
          onClose={() => setMostrarFormulario(false)}
          tipo={formularioEdicion?.tipo || nuevoItem.tipo}
          item={formularioEdicion?.item}
          onSave={handleSave}
        />
      </div>
    </div>
  );
}
