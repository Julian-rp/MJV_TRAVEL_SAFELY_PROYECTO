/**
 * Utilidades para manejo de autenticación
 */

const USER_STORAGE_KEY = "usuario";
const TOKEN_STORAGE_KEY = "access_token";
const REFRESH_TOKEN_STORAGE_KEY = "refresh_token";
const TOKEN_EXPIRY_KEY = "token_expires_at";

/**
 * Guarda los datos del usuario y tokens en localStorage
 */
export const saveUser = (userData, tokens = null) => {
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
  
  // Si se proporcionan tokens, guardarlos
  if (tokens) {
    if (tokens.access_token) {
      localStorage.setItem(TOKEN_STORAGE_KEY, tokens.access_token);
      
      // Calcular tiempo de expiración (1 hora desde ahora)
      const expiresAt = Date.now() + (tokens.expires_in * 1000 || 3600000);
      localStorage.setItem(TOKEN_EXPIRY_KEY, expiresAt.toString());
    }
    
    if (tokens.refresh_token) {
      localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, tokens.refresh_token);
    }
  }
};

/**
 * Obtiene el token de acceso
 */
export const getToken = () => {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
};

/**
 * Obtiene el refresh token
 */
export const getRefreshToken = () => {
  return localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
};

/**
 * Verifica si el token está expirado
 */
export const isTokenExpired = () => {
  const expiresAt = localStorage.getItem(TOKEN_EXPIRY_KEY);
  if (!expiresAt) return true;
  
  return Date.now() >= parseInt(expiresAt);
};

/**
 * Verifica si el token es válido (existe y no está expirado)
 */
export const isTokenValid = () => {
  const token = getToken();
  return token && !isTokenExpired();
};

/**
 * Obtiene los datos del usuario desde localStorage
 */
export const getUser = () => {
  const userData = localStorage.getItem(USER_STORAGE_KEY);
  return userData ? JSON.parse(userData) : null;
};

/**
 * Elimina los datos del usuario y tokens de localStorage
 */
export const removeUser = () => {
  localStorage.removeItem(USER_STORAGE_KEY);
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
  localStorage.removeItem(TOKEN_EXPIRY_KEY);
};

/**
 * Cierra sesión invalidando el token en el servidor
 */
export const logout = async () => {
  try {
    // Intentar invalidar el token en el servidor
    const { authService } = await import("../services/api");
    await authService.logout();
  } catch (error) {
    // Si falla, continuar con la limpieza local
    console.warn("Error al invalidar token en servidor:", error);
  } finally {
    // Siempre limpiar localStorage
    removeUser();
  }
};

/**
 * Verifica si el usuario está autenticado (tiene usuario Y token válido)
 */
export const isAuthenticated = () => {
  const user = getUser();
  const tokenValid = isTokenValid();
  return user !== null && tokenValid;
};

/**
 * Obtiene el tipo de usuario actual
 */
export const getUserType = () => {
  const user = getUser();
  return user?.Tip_usuario || null;
};

/**
 * Verifica si el usuario es administrador
 */
export const isAdmin = () => {
  return getUserType() === "Administrador";
};

