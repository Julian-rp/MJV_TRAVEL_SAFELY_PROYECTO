import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Configurar transporter de Nodemailer
    // Para Gmail, necesitas usar OAuth2 o una contraseña de aplicación
    const smtpUser = process.env.SMTP_USER || process.env.EMAIL_USER;
    const smtpPass = process.env.SMTP_PASS || process.env.EMAIL_PASSWORD;

    if (!smtpUser || !smtpPass) {
      console.warn('⚠️ Variables de entorno SMTP no configuradas. Los emails no se enviarán.');
      console.warn('   Configura SMTP_USER y SMTP_PASS en el archivo .env');
      // Crear un transporter dummy que no funcionará pero evitará errores
      this.transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: 'dummy',
          pass: 'dummy',
        },
      });
    } else {
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false, // true para 465, false para otros puertos
        auth: {
          user: smtpUser,
          pass: smtpPass, // Contraseña de aplicación de Gmail
        },
      });
    }
  }

  /**
   * Envía un email de restablecimiento de contraseña
   */
  async enviarRestablecimientoContrasena(
    correo: string,
    nombre: string,
    token: string,
  ): Promise<boolean> {
    try {
      // Verificar que las credenciales estén configuradas
      const smtpUser = process.env.SMTP_USER || process.env.EMAIL_USER;
      const smtpPass = process.env.SMTP_PASS || process.env.EMAIL_PASSWORD;
      
      if (!smtpUser || !smtpPass || smtpUser === 'dummy' || smtpPass === 'dummy') {
        console.warn('⚠️ Credenciales SMTP no configuradas. No se puede enviar el email.');
        return false;
      }

      const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/restablecer-contrasena?token=${token}`;

      const mailOptions = {
        from: `"Travel Safely" <${process.env.SMTP_USER || process.env.EMAIL_USER}>`,
        to: correo,
        subject: 'Restablecer Contraseña - Travel Safely',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
                color: white;
                padding: 30px;
                text-align: center;
                border-radius: 8px 8px 0 0;
              }
              .content {
                background: #f9f9f9;
                padding: 30px;
                border-radius: 0 0 8px 8px;
              }
              .button {
                display: inline-block;
                padding: 12px 30px;
                background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
                color: white;
                text-decoration: none;
                border-radius: 6px;
                margin: 20px 0;
                font-weight: bold;
              }
              .button:hover {
                background: linear-gradient(135deg, #1976D2 0%, #1565C0 100%);
              }
              .footer {
                margin-top: 20px;
                padding-top: 20px;
                border-top: 1px solid #ddd;
                font-size: 12px;
                color: #666;
                text-align: center;
              }
              .warning {
                background: #e3f2fd;
                border-left: 4px solid #2196F3;
                padding: 15px;
                margin: 20px 0;
                border-radius: 4px;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>🔐 Restablecer Contraseña</h1>
              <p>Travel Safely</p>
            </div>
            <div class="content">
              <p>Hola <strong>${nombre}</strong>,</p>
              
              <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta en Travel Safely.</p>
              
              <p>Haz clic en el siguiente botón para restablecer tu contraseña:</p>
              
              <div style="text-align: center;">
                <a href="${resetUrl}" class="button">Restablecer Contraseña</a>
              </div>
              
              <p>O copia y pega este enlace en tu navegador:</p>
              <p style="word-break: break-all; color: #2196F3;">${resetUrl}</p>
              
              <div class="warning">
                <strong>⚠️ Importante:</strong>
                <ul>
                  <li>Este enlace expirará en <strong>1 hora</strong></li>
                  <li>Si no solicitaste este restablecimiento, ignora este email</li>
                  <li>Por seguridad, no compartas este enlace con nadie</li>
                </ul>
              </div>
              
              <p>Si tienes problemas, puedes contactarnos a través de la plataforma.</p>
            </div>
            <div class="footer">
              <p>Este es un email automático, por favor no respondas a este mensaje.</p>
              <p>&copy; ${new Date().getFullYear()} Travel Safely. Todos los derechos reservados.</p>
            </div>
          </body>
          </html>
        `,
        text: `
          Restablecer Contraseña - Travel Safely
          
          Hola ${nombre},
          
          Recibimos una solicitud para restablecer la contraseña de tu cuenta.
          
          Haz clic en el siguiente enlace para restablecer tu contraseña:
          ${resetUrl}
          
          Este enlace expirará en 1 hora.
          
          Si no solicitaste este restablecimiento, ignora este email.
          
          Saludos,
          Equipo Travel Safely
        `,
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Email enviado:', info.messageId);
      return true;
    } catch (error) {
      console.error('❌ Error al enviar email:', error);
      return false;
    }
  }

  /**
   * Verifica la configuración del servicio de email
   */
  async verificarConexion(): Promise<boolean> {
    try {
      const smtpUser = process.env.SMTP_USER || process.env.EMAIL_USER;
      const smtpPass = process.env.SMTP_PASS || process.env.EMAIL_PASSWORD;
      
      // Si no hay credenciales configuradas, no intentar verificar
      if (!smtpUser || !smtpPass) {
        console.log('ℹ️  Email backend no configurado. Se usará EmailJS desde el frontend.');
        return false;
      }
      
      await this.transporter.verify();
      console.log('✅ Servidor de email backend listo');
      return true;
    } catch (error) {
      console.warn('⚠️  Email backend no disponible. Se usará EmailJS desde el frontend.');
      console.warn('   Error:', error.message);
      return false;
    }
  }
}

