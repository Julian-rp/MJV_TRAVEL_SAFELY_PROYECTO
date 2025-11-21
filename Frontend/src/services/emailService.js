import emailjs from '@emailjs/browser';
import { EMAILJS_CONFIG } from '../config/constants';

/**
 * Servicio para enviar emails usando EmailJS
 * Solo incluye: restablecimiento de contraseña y bienvenida
 */
export const emailService = {
  /**
   * Envía un email de restablecimiento de contraseña
   */
  enviarRestablecimientoContrasena: async (correo, nombre, resetUrl) => {
    try {
      // Verificar que EmailJS esté configurado
      if (!EMAILJS_CONFIG.SERVICE_ID || !EMAILJS_CONFIG.TEMPLATE_ID || !EMAILJS_CONFIG.PUBLIC_KEY) {
        console.warn('⚠️ EmailJS no está configurado. Configura las variables de entorno VITE_EMAILJS_*');
        return {
          exito: false,
          mensaje: 'EmailJS no está configurado. Contacta al administrador.'
        };
      }

      // Inicializar EmailJS con la clave pública
      emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);

      // Parámetros del template de EmailJS
      // Usar las variables que coinciden con el template: {{link}} y {{email}}
      const templateParams = {
        link: resetUrl,
        email: correo,
        to_name: nombre, // Variable adicional por si la necesitas en el futuro
        from_name: 'Travel Safely',
      };

      // Enviar email
      const response = await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        templateParams
      );

      console.log('✅ Email enviado exitosamente:', response);
      return {
        exito: true,
        mensaje: 'Email enviado correctamente'
      };
    } catch (error) {
      console.error('❌ Error al enviar email con EmailJS:', error);
      return {
        exito: false,
        mensaje: 'Error al enviar el email: ' + (error.text || error.message)
      };
    }
  },

  /**
   * Envía un email de bienvenida cuando el empleado inicia sesión
   */
  enviarEmailBienvenida: async (correo, nombre) => {
    try {
      // Verificar que EmailJS esté configurado
      if (!EMAILJS_CONFIG.SERVICE_ID || !EMAILJS_CONFIG.TEMPLATE_ID || !EMAILJS_CONFIG.PUBLIC_KEY) {
        console.warn('⚠️ EmailJS no está configurado. Configura las variables de entorno VITE_EMAILJS_*');
        return {
          exito: false,
          mensaje: 'EmailJS no está configurado. Contacta al administrador.'
        };
      }

      // Inicializar EmailJS con la clave pública
      emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);

      // Parámetros del template de EmailJS
      const templateParams = {
        email: correo,
        to_name: nombre,
        from_name: 'Travel Safely',
        titulo_email: '¡Bienvenido de nuevo!',
        mensaje_principal: 'Nos alegra verte de nuevo en nuestra plataforma. Estamos aquí para ayudarte con tu transporte diario.',
        texto_boton: 'Ir a mi Dashboard',
        fecha_login: new Date().toLocaleString('es-ES', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        })
      };

      // Usar el template de bienvenida, o el template por defecto si no está configurado
      const templateId = EMAILJS_CONFIG.TEMPLATE_ID_BIENVENIDA || EMAILJS_CONFIG.TEMPLATE_ID;
      
      if (!templateId) {
        console.warn('⚠️ No hay template configurado para bienvenida.');
        return {
          exito: false,
          mensaje: 'Template de bienvenida no configurado. Contacta al administrador.'
        };
      }
      
      const response = await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        templateId,
        templateParams
      );

      console.log('✅ Email de bienvenida enviado:', response);
      return {
        exito: true,
        mensaje: 'Email de bienvenida enviado correctamente'
      };
    } catch (error) {
      console.error('❌ Error al enviar email de bienvenida:', error);
      return {
        exito: false,
        mensaje: 'Error al enviar el email: ' + (error.text || error.message)
      };
    }
  },
};
