import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import '../styles/RestablecerContrasena.css';
import { authService } from '../services/api';

export default function RestablecerContrasena() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [nuevaContrasena, setNuevaContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificando, setVerificando] = useState(true);
  const [tokenValido, setTokenValido] = useState(false);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    const verificarToken = async () => {
      if (!token) {
        setMensaje('❌ No se proporcionó un token de restablecimiento');
        setTokenValido(false);
        setVerificando(false);
        return;
      }

      try {
        const result = await authService.verificarTokenRestablecimiento(token);
        if (result && result.exito) {
          setTokenValido(true);
          setMensaje('');
        } else {
          setTokenValido(false);
          setMensaje('❌ ' + (result?.mensaje || 'Token inválido o expirado'));
        }
      } catch (error) {
        console.error('Error al verificar token:', error);
        setTokenValido(false);
        setMensaje('❌ Error al verificar el token. Por favor, solicita un nuevo enlace.');
      } finally {
        setVerificando(false);
      }
    };

    verificarToken();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');

    if (!nuevaContrasena || nuevaContrasena.length < 6) {
      setMensaje('❌ La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (nuevaContrasena !== confirmarContrasena) {
      setMensaje('❌ Las contraseñas no coinciden');
      return;
    }

    setLoading(true);

    try {
      const result = await authService.restablecerContrasena(token, nuevaContrasena);

      if (result.exito) {
        setMensaje('✅ ' + result.mensaje);
        setTimeout(() => {
          navigate('/iniciarsesion');
        }, 2000);
      } else {
        setMensaje('❌ ' + (result.mensaje || 'Error al restablecer contraseña'));
      }
    } catch (error) {
      setMensaje('❌ Error al conectar con el servidor. Intente nuevamente.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (verificando) {
    return (
      <div className="restablecer-contrasena-page">
        <div className="restablecer-contrasena-container">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Verificando token...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!tokenValido) {
    return (
      <div className="restablecer-contrasena-page">
        <div className="restablecer-contrasena-container">
          <div className="error-state">
            <h2>Token Inválido o Expirado</h2>
            <p>{mensaje}</p>
            <button onClick={() => navigate('/solicitar-restablecimiento')} className="btn-primary">
              Solicitar Nuevo Enlace
            </button>
            <Link to="/iniciarsesion" className="link-back">
              ← Volver al inicio de sesión
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="restablecer-contrasena-page">
      <div className="restablecer-contrasena-container">
        <div className="restablecer-contrasena-header">
          <h1>Restablecer Contraseña</h1>
          <p>Ingrese su nueva contraseña</p>
        </div>

        <form onSubmit={handleSubmit} className="restablecer-contrasena-form">
          {mensaje && (
            <div className={`mensaje ${mensaje.includes('✅') ? 'exito' : 'error'}`}>
              {mensaje}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="nuevaContrasena">Nueva Contraseña</label>
            <input
              type="password"
              id="nuevaContrasena"
              value={nuevaContrasena}
              onChange={(e) => setNuevaContrasena(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              required
              minLength="6"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmarContrasena">Confirmar Contraseña</label>
            <input
              type="password"
              id="confirmarContrasena"
              value={confirmarContrasena}
              onChange={(e) => setConfirmarContrasena(e.target.value)}
              placeholder="Repita la contraseña"
              required
              minLength="6"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="btn-submit"
            disabled={loading}
          >
            {loading ? 'Restableciendo...' : 'Restablecer Contraseña'}
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

