import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly saltRounds = 10; // Número de rondas para el hash (más seguro pero más lento)

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  /**
   * Hashea una contraseña usando bcrypt
   */
  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, this.saltRounds);
  }

  /**
   * Compara una contraseña en texto plano con un hash
   */
  private async comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    // Si la contraseña almacenada no es un hash (usuarios antiguos), comparar directamente
    // Esto permite migración gradual
    if (!hashedPassword.startsWith('$2b$') && !hashedPassword.startsWith('$2a$')) {
      // Si no es un hash bcrypt, comparar directamente (para compatibilidad con datos existentes)
      return plainPassword === hashedPassword;
    }
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  /**
   * Genera un token JWT para un usuario
   */
  async generateToken(user: any) {
    const payload = {
      sub: user.id_usuario,
      correo: user.Correo,
      tip_usuario: user.Tip_usuario,
      nom_completo: user.Nom_completo,
    };

    return {
      access_token: this.jwtService.sign(payload),
      expires_in: 3600, // 1 hora en segundos
    };
  }

  /**
   * Genera un refresh token (para implementación futura)
   */
  async generateRefreshToken(user: any) {
    const payload = {
      sub: user.id_usuario,
      type: 'refresh',
    };

    return {
      refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' }), // Refresh token válido por 7 días
    };
  }

  async login(correo: string, contrasena: string) {
    // Buscar usuario por correo
    const usuario = await this.prisma.usuarios.findFirst({
      where: { Correo: correo },
      include: { empresa: true }
    });

    if (!usuario) {
      return {
        exito: false,
        mensaje: 'Usuario no encontrado'
      };
    }

    // Verificar contraseña usando bcrypt
    const isPasswordValid = await this.comparePassword(contrasena, usuario.contrasena);
    
    if (!isPasswordValid) {
      return {
        exito: false,
        mensaje: 'Contraseña incorrecta'
      };
    }

    // Si la contraseña es válida pero no está hasheada, hashearla ahora
    if (!usuario.contrasena.startsWith('$2b$') && !usuario.contrasena.startsWith('$2a$')) {
      const hashedPassword = await this.hashPassword(contrasena);
      await this.prisma.usuarios.update({
        where: { id_usuario: usuario.id_usuario },
        data: { contrasena: hashedPassword }
      });
    }

    // Generar tokens
    const tokens = await this.generateToken(usuario);
    const refreshToken = await this.generateRefreshToken(usuario);

    return {
      exito: true,
      mensaje: 'Login exitoso',
      usuario: usuario.Nom_completo,
      data: usuario,
      ...tokens,
      ...refreshToken,
    };
  }

  async registrarEmpleado(empleadoData: {
    nombre: string;
    apellido: string;
    telefono: string;
    correo: string;
    direccion: string;
    contrasena: string;
    tipoUsuario?: string;
  }) {
    try {
      // Verificar si el correo ya existe
      const usuarioExistente = await this.prisma.usuarios.findFirst({
        where: { Correo: empleadoData.correo }
      });

      if (usuarioExistente) {
        return {
          exito: false,
          mensaje: 'El correo ya está registrado'
        };
      }

      // Determinar el tipo de usuario
      const tipoUsuario = empleadoData.tipoUsuario || 'Empleado';

      // Obtener la primera empresa o usar null
      const primeraEmpresa = await this.prisma.empresa.findFirst();

      // Hashear la contraseña antes de guardarla
      const hashedPassword = await this.hashPassword(empleadoData.contrasena);

      // Crear el usuario
      const nuevoUsuario = await this.prisma.usuarios.create({
        data: {
          Tip_usuario: tipoUsuario,
          Nom_completo: `${empleadoData.nombre} ${empleadoData.apellido}`,
          direccion: empleadoData.direccion,
          Correo: empleadoData.correo,
          Telefono: parseInt(empleadoData.telefono),
          contrasena: hashedPassword,
          Id_empresa: primeraEmpresa?.id_empresa || null
        }
      });

      return {
        exito: true,
        mensaje: `${tipoUsuario} registrado correctamente`,
        data: nuevoUsuario
      };
    } catch (error) {
      throw new Error('Error al crear el usuario: ' + error.message);
    }
  }

  async registrarAsesorRuta(asesorData: {
    nombre: string;
    apellido: string;
    telefono: string;
    correo?: string;
    contrasena?: string;
    direccion?: string;
  }) {
    try {
      // Crear el asesor de ruta
      const nuevoAsesor = await this.prisma.asesor_ruta.create({
        data: {
          Nombre: asesorData.nombre,
          Apellido: asesorData.apellido,
          Telefono: asesorData.telefono ? parseInt(asesorData.telefono) : null,
        }
      });

      // Si se proporciona correo y contraseña, también crear un usuario para login
      if (asesorData.correo && asesorData.contrasena) {
        // Verificar si el correo ya existe
        const usuarioExistente = await this.prisma.usuarios.findFirst({
          where: { Correo: asesorData.correo }
        });

        if (usuarioExistente) {
          // Si ya existe, actualizar el tipo de usuario
          await this.prisma.usuarios.update({
            where: { id_usuario: usuarioExistente.id_usuario },
            data: { Tip_usuario: 'Asesor de Ruta' }
          });
        } else {
          // Obtener la primera empresa o usar null
          const primeraEmpresa = await this.prisma.empresa.findFirst();
          
          // Hashear la contraseña antes de guardarla
          const hashedPassword = await this.hashPassword(asesorData.contrasena);

          // Crear nuevo usuario
          await this.prisma.usuarios.create({
            data: {
              Tip_usuario: 'Asesor de Ruta',
              Nom_completo: `${asesorData.nombre} ${asesorData.apellido}`,
              direccion: asesorData.direccion || null,
              Correo: asesorData.correo,
              Telefono: asesorData.telefono ? parseInt(asesorData.telefono) : null,
              contrasena: hashedPassword,
              Id_empresa: primeraEmpresa?.id_empresa || null
            }
          });
        }
      }

      return {
        exito: true,
        mensaje: 'Asesor de ruta registrado correctamente',
        data: nuevoAsesor
      };
    } catch (error) {
      throw new Error('Error al crear el asesor de ruta: ' + error.message);
    }
  }

  async registrarPatrocinador(patrocinadorData: {
    nombre: string;
    apellido: string;
    telefono?: string;
    correo?: string;
    direccion?: string;
    contrasena?: string;
    montoPago?: number;
    metodoPago?: string;
  }) {
    try {
      // Obtener la primera empresa o usar null
      const primeraEmpresa = await this.prisma.empresa.findFirst();

      // Crear el patrocinador
      const nuevoPatrocinador = await this.prisma.patrocinador.create({
        data: {
          Nombre: `${patrocinadorData.nombre} ${patrocinadorData.apellido}`,
          Monto_pago: patrocinadorData.montoPago || 0,
          Metodo_pago: patrocinadorData.metodoPago || null,
          Id_empresa: primeraEmpresa?.id_empresa || null
        }
      });

      // Si se proporciona correo y contraseña, también crear un usuario para login
      if (patrocinadorData.correo && patrocinadorData.contrasena) {
        // Verificar si el correo ya existe
        const usuarioExistente = await this.prisma.usuarios.findFirst({
          where: { Correo: patrocinadorData.correo }
        });

        if (usuarioExistente) {
          // Si ya existe, actualizar el tipo de usuario
          await this.prisma.usuarios.update({
            where: { id_usuario: usuarioExistente.id_usuario },
            data: { Tip_usuario: 'Patrocinador' }
          });
        } else {
          // Obtener la primera empresa o usar null
          const primeraEmpresa = await this.prisma.empresa.findFirst();
          
          // Hashear la contraseña antes de guardarla
          const hashedPassword = await this.hashPassword(patrocinadorData.contrasena);

          // Crear nuevo usuario
          await this.prisma.usuarios.create({
            data: {
              Tip_usuario: 'Patrocinador',
              Nom_completo: `${patrocinadorData.nombre} ${patrocinadorData.apellido}`,
              direccion: patrocinadorData.direccion || null,
              Correo: patrocinadorData.correo,
              Telefono: patrocinadorData.telefono ? parseInt(patrocinadorData.telefono) : null,
              contrasena: hashedPassword,
              Id_empresa: primeraEmpresa?.id_empresa || null
            }
          });
        }
      }

      return {
        exito: true,
        mensaje: 'Patrocinador registrado correctamente',
        data: nuevoPatrocinador
      };
    } catch (error) {
      throw new Error('Error al crear el patrocinador: ' + error.message);
    }
  }

  async obtenerUsuarios() {
    return await this.prisma.usuarios.findMany({
      include: { empresa: true }
    });
  }

  async obtenerRoles() {
    try {
      // Obtener todos los roles únicos de la base de datos
      const usuarios = await this.prisma.usuarios.findMany({
        select: { Tip_usuario: true }
      });
      
      // Extraer roles únicos
      let rolesUnicos = [...new Set(usuarios.map(u => u.Tip_usuario))];
      
      // Si no hay roles en la base de datos, usar roles por defecto
      if (rolesUnicos.length === 0) {
        rolesUnicos = ['Empleado', 'Administrador'];
      }
      
      return {
        exito: true,
        roles: rolesUnicos.sort()
      };
    } catch (error) {
      // En caso de error, devolver roles por defecto
      return {
        exito: true,
        roles: ['Empleado', 'Administrador']
      };
    }
  }

  async loginConRol(correo: string, contrasena: string, rol: string) {
    // Mapear nombres de roles del frontend a los nombres en la base de datos
    const rolMapping: { [key: string]: string } = {
      'Administrador': 'Administrador',
      'Administrador de la empresa': 'Administrador',
      'Empleado': 'Empleado',
      'Conductor': 'Conductor',
      'Asesor de Ruta': 'Asesor de Ruta',
      'Patrocinador': 'Patrocinador'
    };

    const rolEnBD = rolMapping[rol] || rol;

    // Buscar usuario por correo
    const usuario = await this.prisma.usuarios.findFirst({
      where: { Correo: correo },
      include: { empresa: true }
    });

    if (!usuario) {
      return {
        exito: false,
        mensaje: 'Usuario no encontrado'
      };
    }

    // Verificar que el usuario tenga el rol seleccionado
    if (usuario.Tip_usuario !== rolEnBD) {
      return {
        exito: false,
        mensaje: `El usuario no tiene el rol ${rol}. Rol actual: ${usuario.Tip_usuario}`
      };
    }

    // Verificar contraseña usando bcrypt
    const isPasswordValid = await this.comparePassword(contrasena, usuario.contrasena);
    
    if (!isPasswordValid) {
      return {
        exito: false,
        mensaje: 'Contraseña incorrecta'
      };
    }

    // Si la contraseña es válida pero no está hasheada, hashearla ahora
    if (!usuario.contrasena.startsWith('$2b$') && !usuario.contrasena.startsWith('$2a$')) {
      const hashedPassword = await this.hashPassword(contrasena);
      await this.prisma.usuarios.update({
        where: { id_usuario: usuario.id_usuario },
        data: { contrasena: hashedPassword }
      });
    }

    // Generar tokens
    const tokens = await this.generateToken(usuario);
    const refreshToken = await this.generateRefreshToken(usuario);

    return {
      exito: true,
      mensaje: 'Login exitoso',
      usuario: usuario.Nom_completo,
      data: usuario,
      ...tokens,
      ...refreshToken,
    };
  }

  async actualizarDireccion(idUsuario: number, direccion: string) {
    try {
      const usuario = await this.prisma.usuarios.update({
        where: { id_usuario: idUsuario },
        data: { direccion }
      });

      return {
        exito: true,
        mensaje: 'Dirección actualizada correctamente',
        data: usuario
      };
    } catch (error) {
      throw new Error('Error al actualizar la dirección: ' + error.message);
    }
  }

  async obtenerEmpleadosConDirecciones() {
    try {
      const empleados = await this.prisma.usuarios.findMany({
        where: {
          OR: [
            { Tip_usuario: 'Empleado' },
            { Tip_usuario: 'Administrador' },
            { Tip_usuario: 'Patrocinador' }
          ],
          direccion: { not: null }
        },
        select: {
          id_usuario: true,
          Nom_completo: true,
          direccion: true,
          Telefono: true,
          Correo: true,
          Tip_usuario: true
        }
      });

      return {
        exito: true,
        data: empleados
      };
    } catch (error) {
      throw new Error('Error al obtener empleados: ' + error.message);
    }
  }

  async solicitarRuta(idUsuario: number, datosRuta: any, createdBy?: number) {
    try {
      // Obtener usuario
      const usuario = await this.prisma.usuarios.findUnique({
        where: { id_usuario: idUsuario }
      });

      if (!usuario) {
        return {
          exito: false,
          mensaje: 'Usuario no encontrado'
        };
      }

      if (!usuario.direccion) {
        return {
          exito: false,
          mensaje: 'Debe registrar su dirección antes de solicitar una ruta'
        };
      }

      // Preparar datos de la solicitud
      const datosSolicitud: any = {
        Id_usuario: idUsuario,
        Direccion: usuario.direccion,
        Hora_Salida: datosRuta.horaSalida ? new Date(datosRuta.horaSalida) : null,
        Hora_Entrada: datosRuta.horaEntrada ? new Date(datosRuta.horaEntrada) : null,
        Observaciones: datosRuta.observaciones || null,
        Estado: 'Pendiente'
      };

      // Nota: Los campos createdBy y updatedBy se agregarán cuando el cliente de Prisma se regenere
      // Por ahora, no los incluimos para evitar errores de validación

      // Crear una SOLICITUD de ruta (no una ruta directamente)
      const solicitud = await this.prisma.solicitud_ruta.create({
        data: datosSolicitud,
        include: {
          usuario: true
        }
      });

      return {
        exito: true,
        mensaje: 'Solicitud de ruta creada correctamente. Los conductores la verán en sus solicitudes pendientes.',
        data: solicitud
      };
    } catch (error) {
      console.error('Error completo al solicitar ruta:', error);
      console.error('Detalles del error:', {
        code: error.code,
        meta: error.meta,
        message: error.message
      });
      return {
        exito: false,
        mensaje: 'Error al solicitar la ruta: ' + (error.message || 'Error desconocido. Verifica que el servidor esté corriendo y que la base de datos esté actualizada.')
      };
    }
  }

  async obtenerRutasConParadas() {
    try {
      const rutas = await this.prisma.ruta.findMany({
        include: {
          usuario: {
            select: {
              id_usuario: true,
              Nom_completo: true,
              direccion: true,
              Telefono: true
            }
          },
          ruta_servicio: {
            include: {
              servicio: {
                include: {
                  parada: true
                }
              }
            }
          }
        }
      });

      return {
        exito: true,
        data: rutas
      };
    } catch (error) {
      throw new Error('Error al obtener rutas: ' + error.message);
    }
  }

  async obtenerRutaConDetalles(idRuta: number) {
    try {
      const ruta = await this.prisma.ruta.findUnique({
        where: { Id_ruta: idRuta },
        include: {
          usuario: {
            select: {
              id_usuario: true,
              Nom_completo: true,
              direccion: true,
              Telefono: true,
              Correo: true
            }
          },
          ruta_servicio: {
            include: {
              servicio: {
                include: {
                  parada: true
                }
              }
            }
          },
          asesor_ruta: true
        }
      });

      return {
        exito: true,
        data: ruta
      };
    } catch (error) {
      throw new Error('Error al obtener la ruta: ' + error.message);
    }
  }

  /**
   * Solicita un restablecimiento de contraseña
   */
  async solicitarRestablecimientoContrasena(correo: string) {
    try {
      const usuario = await this.prisma.usuarios.findFirst({
        where: { Correo: correo }
      });

      if (!usuario) {
        // Por seguridad, no revelamos si el correo existe o no
        return {
          exito: true,
          mensaje: 'Si el correo existe, se enviará un enlace de restablecimiento'
        };
      }

      // Generar token único
      const crypto = require('crypto');
      const token = crypto.randomBytes(32).toString('hex');

      // Expira en 1 hora
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 1);

      // Invalidar tokens anteriores del usuario
      await this.prisma.password_reset_token.updateMany({
        where: {
          Id_usuario: usuario.id_usuario,
          used: false
        },
        data: {
          used: true
        }
      });

      // Crear nuevo token
      await this.prisma.password_reset_token.create({
        data: {
          Id_usuario: usuario.id_usuario,
          token,
          expiresAt
        }
      });

      // Generar URL de restablecimiento
      const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/restablecer-contrasena?token=${token}`;

      // Intentar enviar email desde el backend
      let emailEnviado = false;
      let errorEmail: string | null = null;
      try {
        emailEnviado = await this.emailService.enviarRestablecimientoContrasena(
          usuario.Correo,
          usuario.Nom_completo,
          token
        );
        
        if (emailEnviado) {
          console.log('✅ Email de restablecimiento enviado correctamente desde el backend');
        } else {
          errorEmail = 'El servicio de email no está configurado correctamente';
        }
      } catch (error) {
        console.error('❌ Error al enviar email desde backend:', error.message);
        errorEmail = error.message || 'Error desconocido al enviar email';
      }

      // Si el backend logró enviar el email, retornar éxito
      if (emailEnviado) {
        return {
          exito: true,
          mensaje: 'Se ha enviado un enlace de restablecimiento a tu correo electrónico. Revisa tu bandeja de entrada (y la carpeta de spam).'
        };
      } else {
        // Si falló, retornar el token para que el frontend lo envíe con EmailJS
        // Esto permite que EmailJS funcione como fallback cuando el backend no tiene SMTP configurado
        return {
          exito: true,
          mensaje: 'Token generado. El email se enviará desde el frontend.',
          token: token,
          resetUrl: resetUrl,
          nombreUsuario: usuario.Nom_completo
        };
      }
    } catch (error) {
      throw new Error('Error al solicitar restablecimiento: ' + error.message);
    }
  }

  /**
   * Restablece la contraseña usando un token
   */
  async restablecerContrasena(token: string, nuevaContrasena: string) {
    try {
      // Buscar token válido
      const resetToken = await this.prisma.password_reset_token.findFirst({
        where: {
          token,
          used: false,
          expiresAt: {
            gt: new Date() // Token no expirado
          }
        },
        include: {
          usuario: true
        }
      });

      if (!resetToken) {
        return {
          exito: false,
          mensaje: 'Token inválido o expirado'
        };
      }

      // Validar nueva contraseña
      if (!nuevaContrasena || nuevaContrasena.length < 6) {
        return {
          exito: false,
          mensaje: 'La contraseña debe tener al menos 6 caracteres'
        };
      }

      // Hashear nueva contraseña
      const hashedPassword = await this.hashPassword(nuevaContrasena);

      // Actualizar contraseña del usuario
      await this.prisma.usuarios.update({
        where: { id_usuario: resetToken.Id_usuario },
        data: { contrasena: hashedPassword }
      });

      // Marcar token como usado
      await this.prisma.password_reset_token.update({
        where: { Id_token: resetToken.Id_token },
        data: { used: true }
      });

      return {
        exito: true,
        mensaje: 'Contraseña restablecida correctamente'
      };
    } catch (error) {
      throw new Error('Error al restablecer contraseña: ' + error.message);
    }
  }

  /**
   * Verifica si un token de restablecimiento es válido
   */
  async verificarTokenRestablecimiento(token: string) {
    try {
      const resetToken = await this.prisma.password_reset_token.findFirst({
        where: {
          token,
          used: false,
          expiresAt: {
            gt: new Date()
          }
        }
      });

      return {
        exito: !!resetToken,
        mensaje: resetToken ? 'Token válido' : 'Token inválido o expirado'
      };
    } catch (error) {
      return {
        exito: false,
        mensaje: 'Error al verificar token: ' + error.message
      };
    }
  }

  /**
   * Invalida un token JWT agregándolo a la blacklist
   */
  async invalidarToken(token: string, userId?: number) {
    try {
      // Decodificar el token para obtener la fecha de expiración
      const decoded = this.jwtService.decode(token) as any;
      const expiresAt = decoded?.exp ? new Date(decoded.exp * 1000) : new Date(Date.now() + 3600000); // 1 hora por defecto

      // Agregar el token a la blacklist
      await this.prisma.token_blacklist.create({
        data: {
          token,
          expiresAt,
          Id_usuario: userId || null,
        }
      });

      // Limpiar tokens expirados (tarea de mantenimiento)
      await this.limpiarTokensExpirados();

      return {
        exito: true,
        mensaje: 'Token invalidado correctamente'
      };
    } catch (error) {
      // Si el token ya existe en la blacklist, está bien
      if (error.code === 'P2002') {
        return {
          exito: true,
          mensaje: 'Token ya estaba invalidado'
        };
      }
      throw new Error('Error al invalidar token: ' + error.message);
    }
  }

  /**
   * Verifica si un token está en la blacklist
   */
  async esTokenValido(token: string): Promise<boolean> {
    try {
      const blacklistedToken = await this.prisma.token_blacklist.findFirst({
        where: {
          token,
          expiresAt: {
            gt: new Date() // Solo considerar tokens que no han expirado
          }
        }
      });

      return !blacklistedToken; // Si no está en la blacklist, es válido
    } catch (error) {
      console.error('Error al verificar token en blacklist:', error);
      return true; // En caso de error, asumir que es válido (fail-open)
    }
  }

  /**
   * Limpia tokens expirados de la blacklist
   */
  private async limpiarTokensExpirados() {
    try {
      await this.prisma.token_blacklist.deleteMany({
        where: {
          expiresAt: {
            lt: new Date() // Eliminar tokens que ya expiraron
          }
        }
      });
    } catch (error) {
      console.error('Error al limpiar tokens expirados:', error);
    }
  }
}
