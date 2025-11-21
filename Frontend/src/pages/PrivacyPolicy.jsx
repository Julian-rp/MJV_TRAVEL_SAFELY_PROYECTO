import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/PrivacyPolicy.css';

export default function PrivacyPolicy() {
  return (
    <div className="privacy-policy-page">
      <div className="privacy-container">
        <div className="privacy-header">
          <h1>Política de Privacidad</h1>
          <p className="last-updated">Última actualización: {new Date().toLocaleDateString('es-ES')}</p>
        </div>

        <div className="privacy-content">
          <section>
            <h2>1. Información que Recopilamos</h2>
            <p>
              En Travel Safely, recopilamos información personal que usted nos proporciona directamente cuando:
            </p>
            <ul>
              <li>Se registra en nuestra plataforma</li>
              <li>Solicita una ruta de transporte</li>
              <li>Actualiza su perfil o información de contacto</li>
              <li>Se comunica con nosotros</li>
            </ul>
            <p>
              La información que recopilamos incluye: nombre completo, correo electrónico, número de teléfono,
              dirección de residencia, y cualquier otra información que usted decida compartir con nosotros.
            </p>
          </section>

          <section>
            <h2>2. Uso de la Información</h2>
            <p>Utilizamos su información personal para:</p>
            <ul>
              <li>Proporcionar y mejorar nuestros servicios de transporte</li>
              <li>Gestionar solicitudes de rutas y asignaciones</li>
              <li>Comunicarnos con usted sobre su cuenta y servicios</li>
              <li>Enviar notificaciones importantes sobre cambios en las rutas</li>
              <li>Cumplir con obligaciones legales y regulatorias</li>
            </ul>
          </section>

          <section>
            <h2>3. Compartir Información</h2>
            <p>
              No vendemos ni alquilamos su información personal a terceros. Compartimos su información únicamente:
            </p>
            <ul>
              <li>Con conductores asignados a sus rutas (nombre, dirección de recogida, teléfono)</li>
              <li>Con administradores del sistema para gestión de rutas</li>
              <li>Cuando sea requerido por ley o autoridades competentes</li>
              <li>Para proteger nuestros derechos legales o prevenir fraudes</li>
            </ul>
          </section>

          <section>
            <h2>4. Seguridad de los Datos</h2>
            <p>
              Implementamos medidas de seguridad técnicas y organizativas para proteger su información personal,
              incluyendo:
            </p>
            <ul>
              <li>Encriptación de contraseñas</li>
              <li>Autenticación mediante tokens JWT</li>
              <li>Acceso restringido a información sensible</li>
              <li>Monitoreo regular de seguridad</li>
            </ul>
          </section>

          <section>
            <h2>5. Sus Derechos</h2>
            <p>Usted tiene derecho a:</p>
            <ul>
              <li>Acceder a su información personal</li>
              <li>Rectificar datos incorrectos o incompletos</li>
              <li>Solicitar la eliminación de su cuenta</li>
              <li>Oponerse al procesamiento de sus datos</li>
              <li>Retirar su consentimiento en cualquier momento</li>
            </ul>
            <p>
              Para ejercer estos derechos, puede contactarnos a través de los canales de comunicación
              proporcionados en la plataforma.
            </p>
          </section>

          <section>
            <h2>6. Retención de Datos</h2>
            <p>
              Conservamos su información personal mientras su cuenta esté activa o según sea necesario para
              proporcionar nuestros servicios. Cuando elimine su cuenta, eliminaremos o anonimizaremos su
              información personal, excepto cuando la ley requiera que la conservemos.
            </p>
          </section>

          <section>
            <h2>7. Cookies y Tecnologías Similares</h2>
            <p>
              Utilizamos cookies y tecnologías similares para mejorar su experiencia, analizar el uso de la
              plataforma y personalizar el contenido. Puede gestionar sus preferencias de cookies a través de
              la configuración de su navegador.
            </p>
          </section>

          <section>
            <h2>8. Cambios a esta Política</h2>
            <p>
              Nos reservamos el derecho de actualizar esta política de privacidad en cualquier momento.
              Le notificaremos sobre cambios significativos mediante un aviso en la plataforma o por correo
              electrónico.
            </p>
          </section>

          <section>
            <h2>9. Contacto</h2>
            <p>
              Si tiene preguntas o inquietudes sobre esta política de privacidad o sobre cómo manejamos su
              información personal, puede contactarnos a través de:
            </p>
            <ul>
              <li>Correo electrónico: privacidad@travelsafely.com</li>
              <li>Teléfono: +57 (1) 234-5678</li>
            </ul>
          </section>
        </div>

        <div className="privacy-footer">
          <Link to="/" className="btn-back">
            ← Volver al Inicio
          </Link>
        </div>
      </div>
    </div>
  );
}

