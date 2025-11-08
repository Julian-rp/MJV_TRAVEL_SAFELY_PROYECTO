import { Link } from "react-router-dom";
import "../styles/nadvar.css";

export default function Navbar() {
  return (
    <header>
      <nav className="navbar">
        {/* Logo + texto */}
        <div className="logo">
          <img src="img/Logo.png" alt="MJ Travel Logo" />
          <span className="brand-name">travel safely</span>
        </div>

        {/* Menú de navegación */}
        <ul className="nav-links">
          <li><Link to="/iniciarsesion">Iniciar Sesion</Link></li>
          <li><Link to="/registrate">Registrate</Link></li>
          <li><Link to="/nosotros">Nosotros</Link></li>
        </ul>
      </nav>
    </header>
  );
}

