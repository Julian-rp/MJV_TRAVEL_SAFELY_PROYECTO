import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/SolicitarRestablecimiento.css';
import { authService } from '../services/api';
import { emailService } from '../services/emailService';
import { validateEmail } from '../utils/validation';

export default function SolicitarRestablecimiento() {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState('');
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [exito, setExito] = useState(false);
  const [tokenInfo, setTokenInfo] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setExito(false);
    setTokenInfo(null);

    if (!correo) {
      setMensaje('❌ Por favor, ingrese su correo electrónico');
      return;
    }

    if (!validateEmail(correo)) {
      setMensaje('❌ Por favor, ingrese un correo electrónico válido');
      return;
    }

    setLoading(true);

    try {
      // Solicitar restablecimiento al backend
      // El backend intentará enviar el email. Si no está configurado, retornará el token para que el frontend lo envíe con EmailJS
      const result = await authService.solicitarRestablecimiento(correo);

      if (result.exito) {
        // Si el backend retorna el token y URL, enviar email con EmailJS (fallback)
        if (result.token && result.resetUrl) {
          // El backend no pudo enviar el email, usar EmailJS desde el frontend
          const nombreUsuario = result.nombreUsuario || 'Usuario';
          const emailResult = await emailService.enviarRestablecimientoContrasena(
            correo,
            nombreUsuario,
            result.resetUrl
          );

          if (emailResult.exito) {
            setExito(true);
            setMensaje('✅ Se ha enviado un enlace de restablecimiento a tu correo electrónico. Revisa tu bandeja de entrada (y la carpeta de spam).');
          } else {
            // Si EmailJS también falla, mostrar el enlace directamente (modo desarrollo)
            setExito(true);
            setMensaje('⚠️ No se pudo enviar el email automáticamente. Usa este enlace para restablecer tu contraseña:');
            setTokenInfo({
              token: result.token,
              url: result.resetUrl
            });
          }
        } else {
          // El backend ya envió el email correctamente (modo producción con SMTP configurado)
          setExito(true);
          setMensaje('✅ ' + result.mensaje);
        }
      } else {
        // Error real: mostrar mensaje de error
        setMensaje('❌ ' + (result.mensaje || 'Error al solicitar restablecimiento'));
      }
    } catch (error) {
      setMensaje('❌ Error al conectar con el servidor. Intente nuevamente.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="solicitar-restablecimiento-page">
      <div className="solicitar-restablecimiento-container">
        <div className="solicitar-restablecimiento-header">
          <h1>Restablecer Contraseña</h1>
          <p>Ingrese su correo electrónico para recibir un enlace de restablecimiento</p>
        </div>

        <form onSubmit={handleSubmit} className="solicitar-restablecimiento-form">
          {mensaje && (
            <div className={`mensaje ${exito ? 'exito' : 'error'}`}>
              {mensaje}
            </div>
          )}

          {tokenInfo && (
            <div className="token-info-box">
              <h3>🔑 Información de Desarrollo</h3>
              <p><strong>Token:</strong> {tokenInfo.token}</p>
              <p><strong>URL:</strong></p>
              <a href={tokenInfo.url} target="_blank" rel="noopener noreferrer" className="reset-link">
                {tokenInfo.url}
              </a>
              <p className="token-note">
                ⚠️ Esta información solo se muestra en modo desarrollo. En producción, el token se enviaría por correo.
              </p>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="correo">Correo Electrónico</label>
            <input
              type="email"
              id="correo"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="ejemplo@correo.com"
              required
              disabled={loading || exito}
            />
          </div>

          <button
            type="submit"
            className="btn-submit"
            disabled={loading || exito}
          >
            {loading ? 'Enviando...' : exito ? 'Enviado ✓' : 'Enviar Enlace de Restablecimiento'}
          </button>

          <div className="form-footer">
            <Link to="/iniciarsesion" className="link-back">
              ← Volver al inicio de sesión
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

