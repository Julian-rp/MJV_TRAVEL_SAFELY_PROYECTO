import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "../styles/MapaRuta.css";
import { getUser } from "../utils/auth";
import { rutasService } from "../services/api";
import Breadcrumbs from "../components/Breadcrumbs";

export default function MapaRuta() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const rutaId = searchParams.get("rutaId");
  
  const [usuario, setUsuario] = useState(null);
  const [ruta, setRuta] = useState(null);
  const [empleadosEnRuta, setEmpleadosEnRuta] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mapUrl, setMapUrl] = useState("");

  useEffect(() => {
    const usuarioData = getUser();
    if (!usuarioData) {
      navigate("/iniciarsesion");
      return;
    }
    setUsuario(usuarioData);

    if (rutaId) {
      cargarRuta(parseInt(rutaId));
    } else {
      setLoading(false);
    }
  }, [rutaId, navigate]);

  const cargarRuta = async (id) => {
    try {
      setLoading(true);
      const rutaData = await rutasService.getById(id);
      
      if (rutaData) {
        setRuta(rutaData);
        
        // Obtener empleados asignados a la ruta
        const empleados = rutaData.ruta_empleado || [];
        setEmpleadosEnRuta(empleados.map(re => re.usuario).filter(Boolean));
        
        // Generar URL de Google Maps
        generarMapaUrl(empleados.map(re => re.usuario).filter(Boolean), rutaData);
      }
    } catch (error) {
      console.error("Error al cargar la ruta:", error);
    } finally {
      setLoading(false);
    }
  };

  const generarMapaUrl = (empleados, rutaData) => {
    if (empleados.length === 0) return;

    // Construir URL de Google Maps con todas las direcciones
    const direcciones = empleados
      .map((e) => e.direccion)
      .filter(Boolean)
      .map((d) => encodeURIComponent(d));

    let url = `https://www.google.com/maps/dir/${direcciones.join("/")}`;
    
    // Agregar destino final si existe
    if (rutaData.Direccion_Encuentro) {
      url += `/${encodeURIComponent(rutaData.Direccion_Encuentro)}`;
    }

    setMapUrl(url);
  };

  const handleVolver = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="mapa-ruta-container">
        <div className="mapa-loading">
          <div className="spinner"></div>
          <p>Cargando ruta...</p>
        </div>
      </div>
    );
  }

  if (!ruta || empleadosEnRuta.length === 0) {
    return (
      <div className="mapa-ruta-container">
        <div className="mapa-header-full">
          <button onClick={handleVolver} className="btn-volver-mapa">
            ← Volver
          </button>
          <h2>Visualización de Ruta</h2>
        </div>
        <div className="mapa-vacio-full">
          <div className="mapa-vacio-icono">🚫</div>
          <p>No hay empleados asignados a esta ruta.</p>
          <button onClick={handleVolver} className="btn-volver-mapa">
            Volver al Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Construir URL del iframe de Google Maps
  const construirIframeUrl = () => {
    if (empleadosEnRuta.length === 0) return "";
    
    // Construir URL con todas las direcciones para mostrar en el mapa
    const direcciones = empleadosEnRuta
      .map((e) => e.direccion)
      .filter(Boolean)
      .map((d) => encodeURIComponent(d));
    
    if (direcciones.length === 0) return "";
    
    // Si hay destino final, agregarlo
    let urlParams = direcciones.join("/");
    if (ruta?.Direccion_Encuentro) {
      urlParams += `/${encodeURIComponent(ruta.Direccion_Encuentro)}`;
    }
    
    // Usar la URL de direcciones de Google Maps (funciona sin API key)
    // Esta URL mostrará la ruta con todas las paradas
    return `https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d${direcciones.length}!2d0!3d0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0!2s${encodeURIComponent(direcciones[0])}!3m2!1s0!2s0!4m5!1s0!2s${urlParams}!5e0!3m2!1ses!2smx!4v${Date.now()}`;
  };
  
  // Alternativa: usar el modo de búsqueda sin API key
  const construirIframeUrlAlternativa = () => {
    if (empleadosEnRuta.length === 0) return "";
    
    const primeraDireccion = empleadosEnRuta[0].direccion || "";
    if (!primeraDireccion) return "";
    
    // URL simple que funciona sin API key usando el modo de búsqueda
    return `https://maps.google.com/maps?q=${encodeURIComponent(primeraDireccion)}&output=embed&z=13`;
  };

  return (
    <div className="mapa-ruta-container">
      <Breadcrumbs />
      <div className="mapa-header-full">
        <button onClick={handleVolver} className="btn-volver-mapa">
          ← Volver
        </button>
        <div className="mapa-header-info">
          <h2>🗺️ Ruta: {ruta.Placas || ruta.Id_ruta}</h2>
          <p className="mapa-subtitle">
            {empleadosEnRuta.length} parada{empleadosEnRuta.length !== 1 ? 's' : ''} • 
            {ruta.Direccion_Encuentro && ` Destino: ${ruta.Direccion_Encuentro}`}
          </p>
        </div>
        <a
          href={mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-abrir-maps-externo"
        >
          🗺️ Abrir en Google Maps
        </a>
      </div>

      <div className="mapa-content-full">
        <div className="mapa-sidebar">
          <div className="mapa-sidebar-header">
            <h3>📍 Paradas de Recogida</h3>
            <span className="badge-paradas">{empleadosEnRuta.length}</span>
          </div>

          <div className="mapa-lista-empleados">
            {empleadosEnRuta.map((empleado, index) => (
              <div key={empleado.id_usuario} className="empleado-item-mapa">
                <div className="empleado-numero">{index + 1}</div>
                <div className="empleado-info-mapa">
                  <strong>{empleado.Nom_completo}</strong>
                  <p className="empleado-direccion">{empleado.direccion || "Sin dirección"}</p>
                  {empleado.Telefono && (
                    <p className="empleado-telefono">📞 {empleado.Telefono}</p>
                  )}
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(empleado.direccion || "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ver-mapa-individual"
                  >
                    Ver en Maps
                  </a>
                </div>
              </div>
            ))}
          </div>

          {ruta.Direccion_Encuentro && (
            <div className="mapa-destino-section">
              <h3>🏁 Destino Final</h3>
              <div className="destino-item">
                <p className="destino-direccion">{ruta.Direccion_Encuentro}</p>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ruta.Direccion_Encuentro)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ver-mapa-individual"
                >
                  Ver en Maps
                </a>
              </div>
            </div>
          )}

          <div className="mapa-info-ruta">
            <h3>ℹ️ Información de la Ruta</h3>
            <div className="info-ruta-item">
              <strong>Placas:</strong> {ruta.Placas || "N/A"}
            </div>
            {ruta.Marca && (
              <div className="info-ruta-item">
                <strong>Marca:</strong> {ruta.Marca}
              </div>
            )}
            <div className="info-ruta-item">
              <strong>Capacidad:</strong> {ruta.Capacidad || 20} puestos
            </div>
            <div className="info-ruta-item">
              <strong>Ocupados:</strong> {empleadosEnRuta.length} / {ruta.Capacidad || 20}
            </div>
          </div>
        </div>

        <div className="mapa-principal">
          <div className="mapa-iframe-wrapper">
            {empleadosEnRuta.length > 0 && construirIframeUrlAlternativa() ? (
              <iframe
                src={construirIframeUrlAlternativa()}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Mapa de Ruta"
              ></iframe>
            ) : (
              <div className="mapa-placeholder-full">
                <div className="mapa-placeholder-content">
                  <div className="mapa-icon-grande">🗺️</div>
                  <h3>Mapa Interactivo</h3>
                  <p>Haz clic en "Abrir en Google Maps" para ver la ruta completa con todas las paradas.</p>
                  {mapUrl && (
                    <a
                      href={mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-abrir-ruta-completa"
                    >
                      🗺️ Abrir Ruta Completa en Google Maps
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="mapa-overlay-controls">
            <div className="mapa-controls-info">
              <span>📍 {empleadosEnRuta.length} paradas</span>
              {ruta.Direccion_Encuentro && <span>🏁 Destino incluido</span>}
            </div>
            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-abrir-ruta-completa"
            >
              🗺️ Abrir Ruta Completa con Indicaciones
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

