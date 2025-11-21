import React, { useState } from "react";
import "../styles/RegistroModal.css";
import { authService } from "../services/api";
import { validateEmail, validatePasswordLength } from "../utils/validation";

export default function RegistroModal({ isOpen, onClose, onSuccess }) {
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);
  const [tipoRegistro, setTipoRegistro] = useState("Empleado");
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [aceptaPrivacidad, setAceptaPrivacidad] = useState(false);

  const tiposRegistro = [
    "Empleado",
    "Asesor de Ruta",
    "Administrador de la empresa",
    "Patrocinador",
    "Conductor",
  ];

  const registrarUsuario = async (e) => {
    e.preventDefault();
    setMensaje("");
    setLoading(true);

    const nombre = document.getElementById("registroNombre")?.value || "";
    const apellido = document.getElementById("registroApellido")?.value || "";
    const telefono = document.getElementById("registroTelefono")?.value || "";
    const correo = document.getElementById("registroCorreo")?.value || "";
    const direccion = document.getElementById("registroDireccion")?.value || "";
    const contrasena = document.getElementById("registroContrasena")?.value || "";
    const montoPago = document.getElementById("registroMontoPago")?.value || "";
    const metodoPago = document.getElementById("registroMetodoPago")?.value || "";

    // Validar campos básicos
    if (!nombre || !apellido || !telefono) {
      setMensaje("❌ Por favor, complete nombre, apellido y teléfono");
      setLoading(false);
      return;
    }

    // Validar consentimiento informado
    if (!aceptaTerminos || !aceptaPrivacidad) {
      setMensaje("❌ Debe aceptar los términos y condiciones y la política de privacidad para registrarse");
      setLoading(false);
      return;
    }

    try {
      let result;

      if (tipoRegistro === "Asesor de Ruta") {
        // Validar que todos los campos estén llenos para poder hacer login
        if (!correo || !direccion || !contrasena) {
          setMensaje("❌ Por favor, complete todos los campos para poder iniciar sesión");
          setLoading(false);
          return;
        }

        // Validar formato de email
        if (!validateEmail(correo)) {
          setMensaje("❌ Por favor, ingrese un correo electrónico válido");
          setLoading(false);
          return;
        }

        // Validar longitud de contraseña
        if (!validatePasswordLength(contrasena)) {
          setMensaje("❌ La contraseña debe tener al menos 6 caracteres");
          setLoading(false);
          return;
        }

        result = await authService.registroAsesorRuta({
          nombre,
          apellido,
          telefono,
          correo,
          direccion,
          contrasena,
        });
      } else if (tipoRegistro === "Patrocinador") {
        // Validar que todos los campos estén llenos para poder hacer login
        if (!correo || !direccion || !contrasena) {
          setMensaje("❌ Por favor, complete todos los campos para poder iniciar sesión");
          setLoading(false);
          return;
        }

        // Validar formato de email
        if (!validateEmail(correo)) {
          setMensaje("❌ Por favor, ingrese un correo electrónico válido");
          setLoading(false);
          return;
        }

        // Validar longitud de contraseña
        if (!validatePasswordLength(contrasena)) {
          setMensaje("❌ La contraseña debe tener al menos 6 caracteres");
          setLoading(false);
          return;
        }

        // Registro de patrocinador
        result = await authService.registroPatrocinador({
          nombre,
          apellido,
          telefono,
          correo,
          direccion,
          contrasena,
          montoPago: montoPago ? parseFloat(montoPago) : 0,
          metodoPago,
        });
      } else {
        // Registro de usuario normal (Empleado, Administrador, Conductor)
        // Validar que todos los campos estén llenos
        if (!correo || !direccion || !contrasena) {
          setMensaje("❌ Por favor, complete todos los campos");
          setLoading(false);
          return;
        }

        // Validar formato de email
        if (!validateEmail(correo)) {
          setMensaje("❌ Por favor, ingrese un correo electrónico válido");
          setLoading(false);
          return;
        }

        // Validar longitud de contraseña
        if (!validatePasswordLength(contrasena)) {
          setMensaje("❌ La contraseña debe tener al menos 6 caracteres");
          setLoading(false);
          return;
        }

        // Determinar el tipo de usuario
        let tipoUsuario = "Empleado";
        if (tipoRegistro === "Administrador de la empresa") {
          tipoUsuario = "Administrador";
        } else if (tipoRegistro === "Conductor") {
          tipoUsuario = "Conductor";
        }

        result = await authService.registroEmpleado({
          nombre,
          apellido,
          telefono,
          correo,
          direccion,
          contrasena,
          tipoUsuario,
        });
      }

      if (result.exito) {
        setMensaje(`✅ ${result.mensaje}`);
        // Limpiar formulario
        document.getElementById("registroNombre").value = "";
        document.getElementById("registroApellido").value = "";
        document.getElementById("registroTelefono").value = "";
        document.getElementById("registroCorreo").value = "";
        document.getElementById("registroDireccion").value = "";
        document.getElementById("registroContrasena").value = "";
        if (document.getElementById("registroMontoPago"))
          document.getElementById("registroMontoPago").value = "";
        if (document.getElementById("registroMetodoPago"))
          document.getElementById("registroMetodoPago").value = "";

        // Cerrar modal después de 2 segundos
        setTimeout(() => {
          if (onSuccess) onSuccess();
          onClose();
          setMensaje("");
        }, 2000);
      } else {
        setMensaje(`❌ ${result.mensaje}`);
      }
    } catch (err) {
      console.error("❌ Error en registro:", err);
      const mensajeError = err.message || "Error al conectar con el servidor";
      setMensaje(`❌ ${mensajeError}. Verifica que el backend esté corriendo.`);
    } finally {
      setLoading(false);
    }
  };

  // Determinar qué campos son requeridos según el tipo
  const esUsuarioNormal = ["Empleado", "Administrador de la empresa", "Conductor"].includes(tipoRegistro);
  const esPatrocinador = tipoRegistro === "Patrocinador";
  const esAsesor = tipoRegistro === "Asesor de Ruta";

  if (!isOpen) return null;

  return (
    <div className="registro-modal-overlay" onClick={onClose}>
      <div className="registro-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="registro-modal-close" onClick={onClose}>
          ×
        </button>

        <div className="registro-modal-header">
          <div className="registro-logo-container">
            <div className="registro-logo-square">MJV</div>
          </div>
          <h2 className="registro-modal-title">Crear Cuenta Nueva</h2>
          <p className="registro-modal-subtitle">
            Selecciona el tipo de registro y completa el formulario
          </p>
        </div>

        <form onSubmit={registrarUsuario} className="registro-form-full">
          {mensaje && (
            <div
              className={`registro-mensaje ${
                mensaje.includes("✅") ? "exito" : "error"
              }`}
            >
              {mensaje}
            </div>
          )}

          {/* Selector de tipo de registro */}
          <div className="registro-form-group">
            <label htmlFor="tipoRegistro" className="registro-label">
              Tipo de Registro *
            </label>
            <select
              id="tipoRegistro"
              value={tipoRegistro}
              onChange={(e) => {
                setTipoRegistro(e.target.value);
                setMensaje("");
              }}
              required
              className="registro-input registro-select"
            >
              {tiposRegistro.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
          </div>

          <div className="registro-form-grid">
            <div className="registro-form-group">
              <label htmlFor="registroNombre" className="registro-label">
                Nombres *
              </label>
              <input
                type="text"
                id="registroNombre"
                name="nombre"
                placeholder="Ej. Juan Carlos"
                required
                className="registro-input"
              />
            </div>

            <div className="registro-form-group">
              <label htmlFor="registroApellido" className="registro-label">
                Apellidos *
              </label>
              <input
                type="text"
                id="registroApellido"
                name="apellido"
                placeholder="Ej. Pérez García"
                required
                className="registro-input"
              />
            </div>

            <div className="registro-form-group">
              <label htmlFor="registroTelefono" className="registro-label">
                Teléfono *
              </label>
              <input
                type="tel"
                id="registroTelefono"
                name="telefono"
                placeholder="Ej. 3124567890"
                required
                pattern="[0-9]{7,10}"
                className="registro-input"
              />
            </div>

            <div className="registro-form-group">
              <label htmlFor="registroCorreo" className="registro-label">
                Correo Electrónico *
              </label>
              <input
                type="email"
                id="registroCorreo"
                name="correo"
                placeholder="Ej. juan@example.com"
                required
                className="registro-input"
              />
            </div>

            <div className="registro-form-group">
              <label htmlFor="registroDireccion" className="registro-label">
                Dirección *
              </label>
              <input
                type="text"
                id="registroDireccion"
                name="direccion"
                placeholder="Ej. Calle 45 #10-21"
                required
                className="registro-input"
              />
            </div>

            <div className="registro-form-group">
              <label htmlFor="registroContrasena" className="registro-label">
                Contraseña *
              </label>
              <input
                type="password"
                id="registroContrasena"
                name="contrasena"
                placeholder="Mínimo 6 caracteres"
                required
                minLength="6"
                className="registro-input"
              />
            </div>

            {esPatrocinador && (
              <>
                <div className="registro-form-group">
                  <label htmlFor="registroMontoPago" className="registro-label">
                    Monto de Pago
                  </label>
                  <input
                    type="number"
                    id="registroMontoPago"
                    name="montoPago"
                    placeholder="Ej. 1000000"
                    min="0"
                    step="0.01"
                    className="registro-input"
                  />
                </div>

                <div className="registro-form-group">
                  <label htmlFor="registroMetodoPago" className="registro-label">
                    Método de Pago
                  </label>
                  <input
                    type="text"
                    id="registroMetodoPago"
                    name="metodoPago"
                    placeholder="Ej. Transferencia, Efectivo"
                    className="registro-input"
                  />
                </div>
              </>
            )}
          </div>

          {/* Consentimiento Informado */}
          <div className="registro-consent-section">
            <div className="consent-checkbox-group">
              <input
                type="checkbox"
                id="aceptaTerminos"
                checked={aceptaTerminos}
                onChange={(e) => setAceptaTerminos(e.target.checked)}
                required
                className="consent-checkbox"
              />
              <label htmlFor="aceptaTerminos" className="consent-label">
                Acepto los{' '}
                <a href="/terminos" target="_blank" rel="noopener noreferrer" className="consent-link">
                  Términos y Condiciones
                </a>
                {' '}*
              </label>
            </div>

            <div className="consent-checkbox-group">
              <input
                type="checkbox"
                id="aceptaPrivacidad"
                checked={aceptaPrivacidad}
                onChange={(e) => setAceptaPrivacidad(e.target.checked)}
                required
                className="consent-checkbox"
              />
              <label htmlFor="aceptaPrivacidad" className="consent-label">
                Acepto la{' '}
                <a href="/privacidad" target="_blank" rel="noopener noreferrer" className="consent-link">
                  Política de Privacidad
                </a>
                {' '}*
              </label>
            </div>

            <p className="consent-note">
              * Campos obligatorios. Al registrarse, acepta que procesemos su información personal según
              nuestra política de privacidad y términos de servicio.
            </p>
          </div>

          <div className="registro-form-actions">
            <button
              type="button"
              className="btn-registro-cancelar"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-registro-submit"
              disabled={loading}
            >
              {loading ? "Registrando..." : "REGISTRAR"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
