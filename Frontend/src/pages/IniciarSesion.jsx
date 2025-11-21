import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/iniciarSesion.css";
import { authService } from "../services/api";
import { saveUser } from "../utils/auth";
import { validateEmail } from "../utils/validation";
import RegistroModal from "../components/RegistroModal";

export default function IniciarSesion() {
  const navigate = useNavigate();
  const [mostrarRegistro, setMostrarRegistro] = useState(false);
  const [roles, setRoles] = useState([]);
  const [rolSeleccionado, setRolSeleccionado] = useState("");
  const [loading, setLoading] = useState(false);
  const [mensajeError, setMensajeError] = useState("");

  // Cargar roles disponibles al montar el componente
  useEffect(() => {
    const cargarRoles = async () => {
      try {
        const result = await authService.obtenerRoles();
        // Roles completos que incluyen todos los tipos disponibles
        const todosLosRoles = [
          "Empleado",
          "Administrador",
          "Conductor",
          "Asesor de Ruta",
          "Patrocinador"
        ];
        
        if (result.exito && result.roles && result.roles.length > 0) {
          // Combinar roles del backend con los roles adicionales
          const rolesCombinados = [...new Set([...result.roles, ...todosLosRoles])].sort();
          setRoles(rolesCombinados);
          // Establecer el primer rol como predeterminado
          setRolSeleccionado(rolesCombinados[0]);
        } else {
          // Usar lista completa de roles si no hay respuesta del backend
          setRoles(todosLosRoles);
          setRolSeleccionado(todosLosRoles[0]);
        }
      } catch (error) {
        console.error("Error al cargar roles:", error);
        // Roles por defecto completos si falla la carga
        const rolesPorDefecto = [
          "Empleado",
          "Administrador",
          "Conductor",
          "Asesor de Ruta",
          "Patrocinador"
        ];
        setRoles(rolesPorDefecto);
        setRolSeleccionado(rolesPorDefecto[0]);
      }
    };
    cargarRoles();
  }, []);

  const iniciarSesion = async (e) => {
    e.preventDefault();
    setMensajeError("");
    setLoading(true);

    const correo = document.getElementById("loginCorreo")?.value || "";
    const contrasena = document.getElementById("loginContrasena")?.value || "";

    // Validar que ambos campos estén llenos
    if (!correo || !contrasena) {
      setMensajeError("Por favor, complete todos los campos");
      setLoading(false);
      return;
    }

    // Validar formato de email
    if (!validateEmail(correo)) {
      setMensajeError("Por favor, ingrese un correo electrónico válido");
      setLoading(false);
      return;
    }

    // Validar que se haya seleccionado un rol
    if (!rolSeleccionado) {
      setMensajeError("Por favor, seleccione un rol");
      setLoading(false);
      return;
    }

    try {
      const result = await authService.login(correo, contrasena, rolSeleccionado);

      if (result.exito) {
        // Extraer tokens del resultado
        const tokens = {
          access_token: result.access_token,
          refresh_token: result.refresh_token,
          expires_in: result.expires_in,
        };
        
        // Guardar usuario y tokens en localStorage
        saveUser(result.data, tokens);

        // Redireccionar según el tipo de usuario
        const tipoUsuario = result.data.Tip_usuario;
        if (tipoUsuario === "Administrador") {
          window.location.href = "/admin-dashboard";
        } else if (tipoUsuario === "Conductor") {
          window.location.href = "/conductor-dashboard";
        } else if (tipoUsuario === "Asesor de Ruta") {
          window.location.href = "/asesor-dashboard";
        } else if (tipoUsuario === "Patrocinador") {
          window.location.href = "/patrocinador-dashboard";
        } else {
          // Empleado y otros usuarios
          window.location.href = "/empleado-dashboard";
        }
      } else {
        setMensajeError(result.mensaje || "Error al iniciar sesión");
      }
    } catch (err) {
      console.error("❌ Error en login:", err);
      setMensajeError("Error al conectar con el servidor. Intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="login-page">
      {/* Header */}
      <nav className="login-nav">
        <div className="login-logo">
          <img src="/img/Logo.png" alt="Logo MJ" />
          <span className="brand-name">travel safely</span>
        </div>
        <ul className="login-nav-links">
          <li>
            <Link to="/">Inicio</Link>
          </li>
        </ul>
      </nav>

      {/* Contenido Principal */}
      <div className="login-container">
        {/* Sección Izquierda - Bienvenida */}
        <div className="login-welcome">
          <h1 className="welcome-title">
            Bienvenido a <span className="title-highlight">Travel Safely</span>
          </h1>
          <p className="welcome-subtitle">
            Tu solución integral de transporte empresarial. Conectamos empleados
            con rutas seguras, cómodas y puntuales.
          </p>

          <div className="features-list">
            <div className="feature-card">
              <div className="feature-icon">🚐</div>
              <div className="feature-content">
                <h3>Transporte Seguro</h3>
                <p>Rutas monitoreadas 24/7</p>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon">⏰</div>
              <div className="feature-content">
                <h3>Puntualidad Garantizada</h3>
                <p>Tracking en tiempo real</p>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon">💼</div>
              <div className="feature-content">
                <h3>Servicio Empresarial</h3>
                <p>Comodidad para tu equipo</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sección Derecha - Formulario */}
        <div className="login-form-container">
          <form className="login-form" onSubmit={iniciarSesion}>
            <div className="form-logo">
              <div className="logo-square">MJV</div>
          </div>
            <h2 className="form-title">Iniciar Sesión</h2>
            <p className="form-subtitle">
              Accede a tu cuenta para gestionar tus rutas
            </p>

            {mensajeError && (
              <div className="error-message">{mensajeError}</div>
            )}

            <div className="form-group">
              <label htmlFor="loginCorreo">Correo electrónico o teléfono</label>
          <input
            type="email"
            id="loginCorreo"
                placeholder="ejemplo@empresa.com"
            required
          />
            </div>

            <div className="form-group">
              <label htmlFor="loginContrasena">Contraseña</label>
          <input
            type="password"
            id="loginContrasena"
                placeholder="Ingresa tu contraseña"
            required
          />
            </div>

            <div className="form-group">
              <label htmlFor="rolSelect">Selecciona tu rol</label>
              <select
                id="rolSelect"
                value={rolSeleccionado}
                onChange={(e) => setRolSeleccionado(e.target.value)}
                required
                className="role-select"
              >
                {roles.map((rol) => (
                  <option key={rol} value={rol}>
                    {rol}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="btn-login-primary"
              disabled={loading}
            >
              {loading ? "Iniciando sesión..." : "Iniciar sesión"}
          </button>

            <div className="forgot-password-link">
              <Link to="/solicitar-restablecimiento" className="link-forgot-password">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <div className="form-footer">
              <p className="register-question">¿Eres nuevo?</p>
          <button
                type="button"
                className="btn-register-link"
            onClick={() => setMostrarRegistro(true)}
          >
                Registrarse+
          </button>
        </div>
          </form>
        </div>
          </div>

      {/* Modal de Registro */}
      <RegistroModal
        isOpen={mostrarRegistro}
        onClose={() => {
          setMostrarRegistro(false);
          setMensajeError("");
        }}
        onSuccess={() => {
          setMensajeError("");
          // Opcional: mostrar mensaje de éxito
        }}
      />
        </div>
  );
}
