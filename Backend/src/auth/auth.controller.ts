import { Controller, Post, Body, Get, Patch, Param, UseGuards, Req } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Public } from './public.decorator';
import { SolicitarRestablecimientoDto } from './dto/solicitar-restablecimiento.dto';
import { RestablecerContrasenaDto } from './dto/restablecer-contrasena.dto';
import type { Request } from 'express';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 intentos por minuto para login (protección contra fuerza bruta)
  @Post('login')
  async login(@Body() loginData: { correo: string; contrasena: string; rol?: string }) {
    try {
      // Si se envía el rol, usar login con validación de rol
      if (loginData.rol) {
        const result = await this.authService.loginConRol(
          loginData.correo, 
          loginData.contrasena, 
          loginData.rol
        );
        return result;
      }
      // Si no, usar login tradicional
      const result = await this.authService.login(loginData.correo, loginData.contrasena);
      return result;
    } catch (error) {
      return {
        exito: false,
        mensaje: 'Error al iniciar sesión: ' + error.message
      };
    }
  }

  @Public()
  @Get('roles')
  async obtenerRoles() {
    try {
      const result = await this.authService.obtenerRoles();
      return result;
    } catch (error) {
      return {
        exito: false,
        mensaje: 'Error al obtener roles: ' + error.message,
        roles: []
      };
    }
  }

  @Public()
  @Post('registro_empleado')
  async registrarEmpleado(@Body() empleadoData: {
    nombre: string;
    apellido: string;
    telefono: string;
    correo: string;
    direccion: string;
    contrasena: string;
    tipoUsuario?: string;
  }) {
    try {
      const result = await this.authService.registrarEmpleado(empleadoData);
      return result;
    } catch (error) {
      return {
        exito: false,
        mensaje: 'Error al registrar usuario: ' + error.message
      };
    }
  }

  @Public()
  @Post('registro_asesor')
  async registrarAsesorRuta(@Body() asesorData: {
    nombre: string;
    apellido: string;
    telefono: string;
    correo?: string;
    contrasena?: string;
    direccion?: string;
  }) {
    try {
      const result = await this.authService.registrarAsesorRuta(asesorData);
      return result;
    } catch (error) {
      return {
        exito: false,
        mensaje: 'Error al registrar asesor de ruta: ' + error.message
      };
    }
  }

  @Public()
  @Post('registro_patrocinador')
  async registrarPatrocinador(@Body() patrocinadorData: {
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
      const result = await this.authService.registrarPatrocinador(patrocinadorData);
      return result;
    } catch (error) {
      return {
        exito: false,
        mensaje: 'Error al registrar patrocinador: ' + error.message
      };
    }
  }

  @Get('usuarios')
  async obtenerUsuarios() {
    try {
      const usuarios = await this.authService.obtenerUsuarios();
      return usuarios; // Retornar directamente el array para el frontend
    } catch (error) {
      return {
        exito: false,
        mensaje: 'Error al obtener usuarios: ' + error.message
      };
    }
  }

  @Patch('usuarios/:id/direccion')
  async actualizarDireccion(@Param('id') id: string, @Body() body: { direccion: string }) {
    try {
      const result = await this.authService.actualizarDireccion(parseInt(id), body.direccion);
      return result;
    } catch (error) {
      return {
        exito: false,
        mensaje: 'Error al actualizar dirección: ' + error.message
      };
    }
  }

  @Get('empleados/direcciones')
  async obtenerEmpleadosConDirecciones() {
    try {
      const result = await this.authService.obtenerEmpleadosConDirecciones();
      return result;
    } catch (error) {
      return {
        exito: false,
        mensaje: 'Error al obtener empleados: ' + error.message
      };
    }
  }

  @Post('solicitar-ruta/:idUsuario')
  async solicitarRuta(@Param('idUsuario') idUsuario: string, @Body() datosRuta: any, @Req() request: Request) {
    try {
      // Obtener el usuario autenticado para auditoría
      const user = (request as any).user;
      const userId = user?.id_usuario;
      
      const result = await this.authService.solicitarRuta(parseInt(idUsuario), datosRuta, userId);
      return result;
    } catch (error) {
      console.error('Error en controlador al solicitar ruta:', error);
      return {
        exito: false,
        mensaje: 'Error al solicitar ruta: ' + (error.message || 'Error desconocido. Verifica que el servidor y la base de datos estén actualizados.')
      };
    }
  }

  @Get('rutas/paradas')
  async obtenerRutasConParadas() {
    try {
      const result = await this.authService.obtenerRutasConParadas();
      return result;
    } catch (error) {
      return {
        exito: false,
        mensaje: 'Error al obtener rutas: ' + error.message
      };
    }
  }

  @Get('rutas/:id/detalles')
  async obtenerRutaConDetalles(@Param('id') id: string) {
    try {
      const result = await this.authService.obtenerRutaConDetalles(parseInt(id));
      return result;
    } catch (error) {
      return {
        exito: false,
        mensaje: 'Error al obtener ruta: ' + error.message
      };
    }
  }

  @Public()
  @Post('solicitar-restablecimiento')
  async solicitarRestablecimiento(@Body() body: SolicitarRestablecimientoDto) {
    try {
      const result = await this.authService.solicitarRestablecimientoContrasena(body.correo);
      return result;
    } catch (error) {
      return {
        exito: false,
        mensaje: 'Error al solicitar restablecimiento: ' + error.message
      };
    }
  }

  @Public()
  @Post('restablecer-contrasena')
  async restablecerContrasena(@Body() body: RestablecerContrasenaDto) {
    try {
      const result = await this.authService.restablecerContrasena(body.token, body.nuevaContrasena);
      return result;
    } catch (error) {
      return {
        exito: false,
        mensaje: 'Error al restablecer contraseña: ' + error.message
      };
    }
  }

  @Public()
  @Get('verificar-token/:token')
  async verificarToken(@Param('token') token: string) {
    try {
      const result = await this.authService.verificarTokenRestablecimiento(token);
      return result;
    } catch (error) {
      return {
        exito: false,
        mensaje: 'Error al verificar token: ' + error.message
      };
    }
  }

  @Post('logout')
  async logout(@Req() request: Request, @Body() body: { token?: string }) {
    try {
      // Obtener el token del header Authorization o del body
      let token = body.token;
      
      if (!token) {
        const authHeader = request.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
          token = authHeader.substring(7);
        }
      }

      if (!token) {
        return {
          exito: false,
          mensaje: 'Token no proporcionado'
        };
      }

      // Obtener userId del request (ya validado por el guard)
      const user = (request as any).user;
      const userId = user?.id_usuario;

      const result = await this.authService.invalidarToken(token, userId);
      return result;
    } catch (error) {
      return {
        exito: false,
        mensaje: 'Error al cerrar sesión: ' + error.message
      };
    }
  }
}
