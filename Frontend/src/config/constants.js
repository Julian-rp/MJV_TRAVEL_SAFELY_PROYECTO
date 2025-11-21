// Detectar si estamos en producción y en GitHub Pages
const isProduction = import.meta.env.PROD;
const isGitHubPages = typeof window !== 'undefined' && window.location.hostname.includes('github.io');

// Configuración de la API
// En desarrollo: localhost:3000
// En producción (GitHub Pages): URL del backend desplegado
// En producción (otro hosting): variable de entorno o URL por defecto
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  (isProduction && isGitHubPages
    ? 'https://tu-backend.vercel.app' // ⚠️ CAMBIA ESTO por tu URL de backend desplegado
    : isProduction
    ? 'https://tu-backend.vercel.app' // ⚠️ CAMBIA ESTO por tu URL de backend desplegado
    : 'http://localhost:3000');

// Configuración de EmailJS
export const EMAILJS_CONFIG = {
  SERVICE_ID: import.meta.env.VITE_EMAILJS_SERVICE_ID || "",
  TEMPLATE_ID: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "", // Template para restablecimiento de contraseña
  TEMPLATE_ID_BIENVENIDA: import.meta.env.VITE_EMAILJS_TEMPLATE_ID_BIENVENIDA || "", // Template para email de bienvenida
  PUBLIC_KEY: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "",
};

// Endpoints de la API
export const API_ENDPOINTS = {
  LOGIN: "/login",
  REGISTRO_EMPLEADO: "/registro_empleado",
  USUARIOS: "/usuarios",
  RUTAS: "/ruta",
  EMPRESAS: "/empresa",
};

// Rutas de la aplicación
export const ROUTES = {
  HOME: "/",
  LOGIN: "/iniciarsesion",
  REGISTRO: "/registrate",
  NOSOTROS: "/nosotros",
  RUTAS_CONDUCTOR: "/rutasconductor",
  SOLICITAR_RUTA: "/solicitarruta",
  ADMIN_DASHBOARD: "/admin-dashboard",
  USER_DASHBOARD: "/user-dashboard",
};

