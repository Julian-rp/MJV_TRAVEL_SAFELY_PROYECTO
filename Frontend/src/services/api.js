import { API_BASE_URL } from "../config/constants";

/**
 * Función auxiliar para realizar peticiones HTTP
 */
const fetchAPI = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Obtener token del localStorage
  const token = localStorage.getItem("access_token");
  
  // Construir headers con token si está disponible
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };
  
  // Si hay token, agregarlo al header Authorization
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  const config = {
    headers,
    ...options,
  };

  try {
    console.log(`🔄 Llamando a: ${url}`, config);
    const response = await fetch(url, config);
    
    // Si el token expiró o no es válido (401 Unauthorized), limpiar y redirigir
    if (response.status === 401) {
      localStorage.removeItem("usuario");
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("token_expires_at");
      window.location.href = "/iniciarsesion";
      throw new Error("Sesión expirada. Por favor, inicia sesión nuevamente.");
    }
    
    // Intentar parsear la respuesta como JSON
    let data;
    try {
      const responseText = await response.text();
      if (responseText) {
        data = JSON.parse(responseText);
      } else {
        data = {};
      }
    } catch (e) {
      console.error("Error al parsear respuesta JSON:", e);
      data = {};
    }

    if (!response.ok) {
      console.error(`❌ Error HTTP ${response.status}:`, data);
      const error = new Error(data.mensaje || `HTTP error! status: ${response.status}`);
      error.response = { status: response.status, data };
      throw error;
    }

    console.log(`✅ Respuesta de ${endpoint}:`, data);
    return data;
  } catch (error) {
    console.error(`❌ Error en ${endpoint}:`, error);
    
    // Mejorar el mensaje de error
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      throw new Error('No se pudo conectar con el servidor. Verifica que el backend esté corriendo en http://localhost:3000');
    }
    
    throw error;
  }
};

/**
 * Servicio de autenticación
 */
export const authService = {
  login: async (correo, contrasena, rol = null) => {
    const body = { correo, contrasena };
    if (rol) {
      body.rol = rol;
    }
    return fetchAPI("/login", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  obtenerRoles: async () => {
    return fetchAPI("/roles", {
      method: "GET",
    });
  },

  registroEmpleado: async (datos) => {
    return fetchAPI("/registro_empleado", {
      method: "POST",
      body: JSON.stringify(datos),
    });
  },

  registroAsesorRuta: async (datos) => {
    return fetchAPI("/registro_asesor", {
      method: "POST",
      body: JSON.stringify(datos),
    });
  },

  registroPatrocinador: async (datos) => {
    return fetchAPI("/registro_patrocinador", {
      method: "POST",
      body: JSON.stringify(datos),
    });
  },

  solicitarRestablecimiento: async (correo) => {
    return fetchAPI("/solicitar-restablecimiento", {
      method: "POST",
      body: JSON.stringify({ correo }),
    });
  },

  restablecerContrasena: async (token, nuevaContrasena) => {
    return fetchAPI("/restablecer-contrasena", {
      method: "POST",
      body: JSON.stringify({ token, nuevaContrasena }),
    });
  },

  verificarTokenRestablecimiento: async (token) => {
    return fetchAPI(`/verificar-token/${token}`, {
      method: "GET",
    });
  },

  logout: async () => {
    // Nota: Este endpoint requiere autenticación, así que el token se enviará automáticamente en el header
    return fetchAPI("/logout", {
      method: "POST",
    });
  },
};

/**
 * Servicio de usuarios
 */
export const usuariosService = {
  getAll: async () => {
    return fetchAPI("/usuarios");
  },

  getById: async (id) => {
    return fetchAPI(`/usuarios/${id}`);
  },

  create: async (datos) => {
    return fetchAPI("/usuarios", {
      method: "POST",
      body: JSON.stringify(datos),
    });
  },

  update: async (id, datos) => {
    return fetchAPI(`/usuarios/${id}`, {
      method: "PATCH",
      body: JSON.stringify(datos),
    });
  },

  delete: async (id) => {
    return fetchAPI(`/usuarios/${id}`, {
      method: "DELETE",
    });
  },
};

/**
 * Servicio de rutas
 */
export const rutasService = {
  getAll: async () => {
    return fetchAPI("/ruta");
  },

  getById: async (id) => {
    return fetchAPI(`/ruta/${id}`);
  },

  create: async (datos) => {
    return fetchAPI("/ruta", {
      method: "POST",
      body: JSON.stringify(datos),
    });
  },

  update: async (id, datos) => {
    return fetchAPI(`/ruta/${id}`, {
      method: "PATCH",
      body: JSON.stringify(datos),
    });
  },

  delete: async (id) => {
    return fetchAPI(`/ruta/${id}`, {
      method: "DELETE",
    });
  },
};

/**
 * Servicio de empresas
 */
export const empresasService = {
  getAll: async () => {
    return fetchAPI("/empresa");
  },

  getById: async (id) => {
    return fetchAPI(`/empresa/${id}`);
  },

  create: async (datos) => {
    return fetchAPI("/empresa", {
      method: "POST",
      body: JSON.stringify(datos),
    });
  },

  update: async (id, datos) => {
    return fetchAPI(`/empresa/${id}`, {
      method: "PATCH",
      body: JSON.stringify(datos),
    });
  },

  delete: async (id) => {
    return fetchAPI(`/empresa/${id}`, {
      method: "DELETE",
    });
  },
};

/**
 * Servicio genérico para operaciones CRUD
 */
export const genericService = {
  create: async (tipo, datos) => {
    return fetchAPI(`/${tipo}`, {
      method: "POST",
      body: JSON.stringify(datos),
    });
  },

  update: async (tipo, id, datos) => {
    const idField = 
      tipo === "usuarios" ? "id_usuario" :
      tipo === "ruta" ? "Id_ruta" :
      "id_empresa";
    
    return fetchAPI(`/${tipo}/${datos[idField] || id}`, {
      method: "PATCH",
      body: JSON.stringify(datos),
    });
  },

  delete: async (tipo, id) => {
    return fetchAPI(`/${tipo}/${id}`, {
      method: "DELETE",
    });
  },
};

/**
 * Servicio para funcionalidades de empleados
 */
export const empleadoService = {
  actualizarDireccion: async (idUsuario, direccion) => {
    return fetchAPI(`/usuarios/${idUsuario}/direccion`, {
      method: "PATCH",
      body: JSON.stringify({ direccion }),
    });
  },

  solicitarRuta: async (idUsuario, datosRuta) => {
    return fetchAPI(`/solicitar-ruta/${idUsuario}`, {
      method: "POST",
      body: JSON.stringify(datosRuta),
    });
  },

  obtenerMisSolicitudes: async (idUsuario) => {
    return fetchAPI(`/solicitudes-ruta/usuario/${idUsuario}`, {
      method: "GET",
    });
  },
};

/**
 * Servicio para funcionalidades de conductores
 */
export const conductorService = {
  obtenerEmpleadosConDirecciones: async () => {
    return fetchAPI("/empleados/direcciones", {
      method: "GET",
    });
  },

  obtenerRutas: async () => {
    return fetchAPI("/ruta", {
      method: "GET",
    });
  },

  obtenerSolicitudesPendientes: async () => {
    return fetchAPI("/solicitudes-ruta/pendientes", {
      method: "GET",
    });
  },

  aceptarSolicitud: async (idSolicitud, idConductor, datosRuta) => {
    return fetchAPI(`/solicitudes-ruta/aceptar/${idSolicitud}`, {
      method: "PATCH",
      body: JSON.stringify({ idConductor, ...datosRuta }),
    });
  },

  rechazarSolicitud: async (idSolicitud, idConductor, motivo) => {
    return fetchAPI(`/solicitudes-ruta/rechazar/${idSolicitud}`, {
      method: "PATCH",
      body: JSON.stringify({ idConductor, motivo }),
    });
  },
};

/**
 * Servicio para funcionalidades de asesores
 */
export const asesorService = {
  obtenerRutasConParadas: async () => {
    // Usar el endpoint de rutas que incluye empleados y conductor
    return fetchAPI("/ruta", {
      method: "GET",
    });
  },

  obtenerRutaDetalles: async (idRuta) => {
    return fetchAPI(`/ruta/${idRuta}`, {
      method: "GET",
    });
  },

  obtenerEmpleados: async () => {
    return fetchAPI("/usuarios", {
      method: "GET",
    });
  },
};

