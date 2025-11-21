import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Index from "./pages/Index";
import IniciarSesion from "./pages/IniciarSesion";
import Nosotros from "./pages/Nosotros";
import Registrate from "./pages/Registrate";
import RutasConductor from "./pages/RutasConductor";
import SolicitarRuta from "./pages/SolicitarRuta";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import EmpleadoDashboard from "./pages/EmpleadoDashboard";
import ConductorDashboard from "./pages/ConductorDashboard";
import AsesorRutaDashboard from "./pages/AsesorRutaDashboard";
import PatrocinadorDashboard from "./pages/PatrocinadorDashboard";
import MapaRuta from "./pages/MapaRuta";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import SolicitarRestablecimiento from "./pages/SolicitarRestablecimiento";
import RestablecerContrasena from "./pages/RestablecerContrasena";
import ProtectedRoute from "./components/ProtectedRoute";

function Layout() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/iniciarsesion" element={<IniciarSesion />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/registrate" element={<Registrate />} />
        <Route path="/rutasconductor" element={<RutasConductor />} />
        <Route path="/solicitarruta" element={<SolicitarRuta />} />
        <Route path="/privacidad" element={<PrivacyPolicy />} />
        <Route path="/terminos" element={<TermsAndConditions />} />
        <Route path="/solicitar-restablecimiento" element={<SolicitarRestablecimiento />} />
        <Route path="/restablecer-contrasena" element={<RestablecerContrasena />} />
        <Route 
          path="/admin-dashboard" 
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/user-dashboard" 
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/empleado-dashboard" 
          element={
            <ProtectedRoute>
              <EmpleadoDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/conductor-dashboard" 
          element={
            <ProtectedRoute>
              <ConductorDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/asesor-dashboard" 
          element={
            <ProtectedRoute>
              <AsesorRutaDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/patrocinador-dashboard" 
          element={
            <ProtectedRoute>
              <PatrocinadorDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/mapa-ruta" 
          element={
            <ProtectedRoute>
              <MapaRuta />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}
