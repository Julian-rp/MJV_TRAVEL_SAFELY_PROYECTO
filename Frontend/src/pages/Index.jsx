import React from "react";
import { Link } from "react-router-dom";
import "../styles/Index.css";

export default function Index() {
  return (
    <>
      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-badge">
            <span>🚐 Servicio 100% Gratis</span>
          </div>
          <h1 className="hero-title">
            Transporte Empresarial
            <span className="title-accent"> de Calidad</span>
          </h1>
          <p className="hero-subtitle">
            Movemos tu empresa con seguridad, puntualidad y comodidad. 
            La mejor solución para el transporte de tu equipo.
          </p>
          <div className="hero-features">
            <div className="hero-feature-item">
              <span className="feature-icon">✓</span>
              <span>Rutas Monitoreadas 24/7</span>
            </div>
            <div className="hero-feature-item">
              <span className="feature-icon">✓</span>
              <span>Tracking en Tiempo Real</span>
            </div>
            <div className="hero-feature-item">
              <span className="feature-icon">✓</span>
              <span>Flota Moderna y Segura</span>
            </div>
          </div>
          <div className="hero-cta">
            <Link to="/iniciarsesion" className="btn-primary">
              Iniciar Sesión
            </Link>
            <Link to="/registrate" className="btn-secondary">
              Registrarse
            </Link>
          </div>
        </div>
        <div className="hero-img">
          <div className="hero-img-wrapper">
            <img
              src="img/high-decker-3d-bus-luxury-600nw-2248764237.webp"
              alt="Vehículo empresarial"
              className="hero-image"
            />
            <div className="hero-img-glow"></div>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">¿Por qué elegir Travel Safely?</h2>
            <p className="section-subtitle">
              Ofrecemos las mejores soluciones de transporte empresarial
            </p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-card-icon">
                <span>🚐</span>
              </div>
              <h3>Transporte Seguro</h3>
              <p>
                Rutas monitoreadas 24/7 con vehículos modernos y conductores 
                certificados para garantizar la seguridad de tu equipo.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-card-icon">
                <span>⏰</span>
              </div>
              <h3>Puntualidad Garantizada</h3>
              <p>
                Tracking en tiempo real para que siempre sepas dónde está 
                tu transporte. Llegamos a tiempo, siempre.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-card-icon">
                <span>💼</span>
              </div>
              <h3>Servicio Empresarial</h3>
              <p>
                Comodidad y profesionalismo para tu equipo. 
                Experiencia diseñada pensando en las necesidades corporativas.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-card-icon">
                <span>💰</span>
              </div>
              <h3>100% Gratis</h3>
              <p>
                Sin costos para tu empresa. Nuestros ingresos provienen 
                de alianzas publicitarias, no de nuestros pasajeros.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-card-icon">
                <span>📱</span>
              </div>
              <h3>Plataforma Digital</h3>
              <p>
                Gestiona tus rutas desde cualquier dispositivo. 
                Sistema intuitivo y fácil de usar.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-card-icon">
                <span>🌟</span>
              </div>
              <h3>Experiencia Premium</h3>
              <p>
                Flota de alta calidad con las mejores comodidades 
                para que tu equipo viaje con estilo.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="info-section">
        <div className="container">
          <div className="info-content">
            <h2 className="info-title">Rutas Empresariales</h2>
            <p className="info-text">
              <strong>Rutas Camino al Trabajo</strong> es un servicio de transporte 
              especial en el que llevamos a ti y a tus compañeros de oficina al lugar 
              de trabajo de forma segura, cómoda y puntual.
            </p>
            <p className="info-text">
              Nos enfocamos en crear experiencias de viaje excepcionales, priorizando 
              la seguridad, comodidad y puntualidad en cada ruta. Con tecnología de 
              vanguardia y un equipo comprometido, transformamos el transporte 
              empresarial en una experiencia premium.
            </p>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <div className="footer-container">
            <div className="footer-col">
              <div className="footer-logo">
                <img src="img/Logo.png" alt="Logo" />
                <span className="footer-brand">travel safely</span>
              </div>
              <p className="footer-description">
                Tu solución integral de transporte empresarial.
              </p>
            </div>

            <div className="footer-col">
              <h4>Contacto</h4>
              <div className="footer-contact-item">
                <span className="contact-icon">✉️</span>
                <a href="mailto:director.operaciones@colviajes.com.co">
                  director.operaciones@colviajes.com.co
                </a>
              </div>
              <div className="footer-contact-item">
                <span className="contact-icon">📞</span>
                <a href="tel:+573184871922">(318) 487-1922</a>
              </div>
              <div className="footer-contact-item">
                <span className="contact-icon">📍</span>
                <span>Calle 56a #74a-51, Bogotá, Colombia.</span>
              </div>
            </div>

            <div className="footer-col">
              <h4>Síguenos</h4>
              <div className="social-links">
                <a href="#" className="social-link" aria-label="Facebook">
                  <span>📘</span> Facebook
                </a>
                <a href="#" className="social-link" aria-label="Instagram">
                  <span>📷</span> Instagram
                </a>
              </div>
            </div>

            <div className="footer-col">
              <h4>Servicios</h4>
              <ul className="footer-links">
                <li><Link to="/">Transporte Empresarial</Link></li>
                <li><Link to="/">Transporte VIP & Ejecutivo</Link></li>
                <li><Link to="/">Transporte Turístico</Link></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; 2025 MJV TRAVEL SAFELY. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
