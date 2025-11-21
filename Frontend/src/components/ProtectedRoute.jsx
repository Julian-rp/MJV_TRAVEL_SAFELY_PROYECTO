import { Navigate } from "react-router-dom";
import { getUser, isAuthenticated } from "../utils/auth";

/**
 * Componente que protege rutas, redirigiendo al login si el usuario no está autenticado
 */
export default function ProtectedRoute({ children }) {
  const usuario = getUser();
  const authenticated = isAuthenticated();

  if (!usuario || !authenticated) {
    // Si no hay usuario o el token no es válido, redirigir al login
    return <Navigate to="/iniciarsesion" replace />;
  }

  // Si hay usuario y token válido, mostrar el componente hijo
  return children;
}

