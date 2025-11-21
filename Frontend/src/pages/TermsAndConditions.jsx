import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/TermsAndConditions.css';

export default function TermsAndConditions() {
  return (
    <div className="terms-page">
      <div className="terms-container">
        <div className="terms-header">
          <h1>Términos y Condiciones</h1>
          <p className="last-updated">Última actualización: {new Date().toLocaleDateString('es-ES')}</p>
        </div>

        <div className="terms-content">
          <section>
            <h2>1. Aceptación de los Términos</h2>
            <p>
              Al acceder y utilizar la plataforma Travel Safely, usted acepta estar sujeto a estos términos
              y condiciones. Si no está de acuerdo con alguna parte de estos términos, no debe utilizar
              nuestros servicios.
            </p>
          </section>

          <section>
            <h2>2. Descripción del Servicio</h2>
            <p>
              Travel Safely es una plataforma que conecta empleados con conductores para facilitar el transporte
              compartido. Nuestro servicio incluye:
            </p>
            <ul>
              <li>Gestión de solicitudes de rutas de transporte</li>
              <li>Asignación de empleados a rutas disponibles</li>
              <li>Comunicación entre empleados y conductores</li>
              <li>Visualización de mapas y rutas</li>
            </ul>
          </section>

          <section>
            <h2>3. Registro y Cuenta de Usuario</h2>
            <p>Para utilizar nuestros servicios, debe:</p>
            <ul>
              <li>Proporcionar información veraz, precisa y completa</li>
              <li>Mantener la seguridad de su cuenta y contraseña</li>
              <li>Notificarnos inmediatamente sobre cualquier uso no autorizado</li>
              <li>Ser responsable de todas las actividades bajo su cuenta</li>
            </ul>
          </section>

          <section>
            <h2>4. Uso Aceptable</h2>
            <p>Usted se compromete a:</p>
            <ul>
              <li>Utilizar la plataforma únicamente para fines legítimos</li>
              <li>No interferir con el funcionamiento de la plataforma</li>
              <li>No intentar acceder a áreas restringidas o cuentas de otros usuarios</li>
              <li>No transmitir virus, malware o código malicioso</li>
              <li>Respetar los derechos de otros usuarios</li>
            </ul>
          </section>

          <section>
            <h2>5. Responsabilidades de los Usuarios</h2>
            <h3>5.1 Empleados</h3>
            <ul>
              <li>Proporcionar información de contacto y dirección correcta</li>
              <li>Estar disponible en el lugar y hora acordados</li>
              <li>Comunicar cambios o cancelaciones con anticipación</li>
              <li>Tratar con respeto a conductores y otros pasajeros</li>
            </ul>

            <h3>5.2 Conductores</h3>
            <ul>
              <li>Mantener vehículos en condiciones seguras y legales</li>
              <li>Contar con licencia de conducción vigente</li>
              <li>Cumplir con los horarios y rutas acordados</li>
              <li>Tratar con respeto a todos los pasajeros</li>
            </ul>
          </section>

          <section>
            <h2>6. Limitación de Responsabilidad</h2>
            <p>
              Travel Safely actúa como intermediario entre empleados y conductores. No somos responsables de:
            </p>
            <ul>
              <li>Accidentes de tránsito o incidentes durante el transporte</li>
              <li>Retrasos o cancelaciones por parte de conductores</li>
              <li>Pérdida o daño de pertenencias personales</li>
              <li>Disputas entre usuarios</li>
            </ul>
            <p>
              Los usuarios utilizan nuestros servicios bajo su propio riesgo y deben contar con seguro
              apropiado.
            </p>
          </section>

          <section>
            <h2>7. Propiedad Intelectual</h2>
            <p>
              Todo el contenido de la plataforma, incluyendo diseño, logos, textos, gráficos y software,
              es propiedad de Travel Safely o sus licenciantes y está protegido por leyes de propiedad
              intelectual.
            </p>
          </section>

          <section>
            <h2>8. Modificaciones del Servicio</h2>
            <p>
              Nos reservamos el derecho de modificar, suspender o discontinuar cualquier aspecto del servicio
              en cualquier momento, con o sin previo aviso. No seremos responsables ante usted o terceros por
              cualquier modificación, suspensión o discontinuación del servicio.
            </p>
          </section>

          <section>
            <h2>9. Terminación</h2>
            <p>
              Podemos terminar o suspender su cuenta y acceso al servicio inmediatamente, sin previo aviso,
              por cualquier motivo, incluyendo si viola estos términos y condiciones.
            </p>
          </section>

          <section>
            <h2>10. Ley Aplicable</h2>
            <p>
              Estos términos se rigen por las leyes de Colombia. Cualquier disputa relacionada con estos
              términos será resuelta en los tribunales competentes de Colombia.
            </p>
          </section>

          <section>
            <h2>11. Contacto</h2>
            <p>
              Si tiene preguntas sobre estos términos y condiciones, puede contactarnos a través de:
            </p>
            <ul>
              <li>Correo electrónico: legal@travelsafely.com</li>
              <li>Teléfono: +57 (1) 234-5678</li>
            </ul>
          </section>
        </div>

        <div className="terms-footer">
          <Link to="/" className="btn-back">
            ← Volver al Inicio
          </Link>
        </div>
      </div>
    </div>
  );
}

