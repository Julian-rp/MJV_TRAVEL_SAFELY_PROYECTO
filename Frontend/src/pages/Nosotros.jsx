import React from "react";
import "../styles/Nosotros.css";


export default function Nosotros() {
  return (
    <>
      <nav>
        <div className="logo">
          <img src="../img/Logo.png" alt="Logo MJ" />
          <span className="brand-name">travel safely</span>
        </div>
        <ul>
          <li><a href="/">Inicio</a></li>
        </ul>
      </nav>

      <section className="info">
        <h2>¿Quiénes Somos?</h2>
        <p>
          En <strong>MJ Travel Safely</strong> ofrecemos un innovador servicio de transporte empresarial totalmente <strong>gratuito</strong> para los usuarios. Nuestra misión es facilitar la movilidad diaria de los trabajadores, sin generarles ningún costo, garantizando seguridad, puntualidad y comodidad en cada viaje.
        </p>
        <p>
          Este modelo es posible gracias a que nuestros ingresos provienen de alianzas comerciales y publicidad estratégica. Las empresas patrocinadoras aprovechan nuestros vehículos y plataformas digitales como espacios para promocionar sus marcas, permitiéndonos cubrir los costos operativos sin cobrarle a nuestros pasajeros.
        </p>
        <p>
          Creemos en una movilidad más justa, sostenible y accesible. Gracias a la confianza de nuestros aliados, convertimos el transporte empresarial en un beneficio real para empleados, empresas y anunciantes.
        </p>
      </section>

      <section className="aliados">
        <h2>Estos son algunos de nuestros aliados</h2>
        <div className="aliados-logos">
          <img src="../img/ramo.png" alt="Aliado 1" />
          <img src="../img/falabella.png" alt="Aliado 2" />
          <img src="../img/KFC-logo.png" alt="Aliado 3" />
          <img src="../img/net.png" alt="Aliado 4" />
        </div>
      </section>

      <footer className="footer">
        <div className="footer-container">
          <div className="footer-col">
            <h4>EMAIL</h4>
            <p><a href="mailto:director.operaciones@colviajes.com.co">director.operaciones@colviajes.com.co</a></p>
            <h4>TELÉFONO</h4>
            <p>(318) 487-1922</p>
            <h4>DIRECCIÓN</h4>
            <p>Calle 56a #74a-51, Bogotá, Colombia.</p>
          </div>

          <div className="footer-col">
            <h4>SÍGUENOS EN:</h4>
            <p><a href="#">Facebook</a></p>
            <p><a href="#">Instagram</a></p>
          </div>

          <div className="footer-col">
            <h4>SERVICIOS</h4>
            <ul>
              <li><a href="#">Transporte Empresarial</a></li>
              <li><a href="#">Transporte VIP & Ejecutivo</a></li>
              <li><a href="#">Transporte Turístico</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>Todos los derechos reservados © 2025 | COLVIAJES</p>
        </div>
      </footer>
    </>
  );
}