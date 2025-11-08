import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { SolicitudesRutaService } from './solicitudes-ruta.service';

@Controller('solicitudes-ruta')
export class SolicitudesRutaController {
  constructor(private readonly solicitudesRutaService: SolicitudesRutaService) {}

  // Crear nueva solicitud (empleados)
  @Post(':idUsuario')
  async crearSolicitud(
    @Param('idUsuario') idUsuario: string,
    @Body() datos: any
  ) {
    try {
      return await this.solicitudesRutaService.crearSolicitud(+idUsuario, datos);
    } catch (error) {
      return {
        exito: false,
        mensaje: error.message
      };
    }
  }

  // Obtener solicitudes pendientes (conductores)
  @Get('pendientes')
  async obtenerPendientes() {
    try {
      return await this.solicitudesRutaService.obtenerSolicitudesPendientes();
    } catch (error) {
      return {
        exito: false,
        mensaje: error.message
      };
    }
  }

  // Obtener solicitudes de un usuario específico
  @Get('usuario/:idUsuario')
  async obtenerPorUsuario(@Param('idUsuario') idUsuario: string) {
    try {
      return await this.solicitudesRutaService.obtenerSolicitudesPorUsuario(+idUsuario);
    } catch (error) {
      return {
        exito: false,
        mensaje: error.message
      };
    }
  }

  // Aceptar solicitud (conductores)
  @Patch('aceptar/:idSolicitud')
  async aceptarSolicitud(
    @Param('idSolicitud') idSolicitud: string,
    @Body() body: any
  ) {
    try {
      const { idConductor, ...datosRuta } = body;
      return await this.solicitudesRutaService.aceptarSolicitud(
        +idSolicitud,
        idConductor,
        datosRuta
      );
    } catch (error) {
      return {
        exito: false,
        mensaje: error.message
      };
    }
  }

  // Rechazar solicitud (conductores)
  @Patch('rechazar/:idSolicitud')
  async rechazarSolicitud(
    @Param('idSolicitud') idSolicitud: string,
    @Body() body: any
  ) {
    try {
      const { idConductor, motivo } = body;
      return await this.solicitudesRutaService.rechazarSolicitud(
        +idSolicitud,
        idConductor,
        motivo
      );
    } catch (error) {
      return {
        exito: false,
        mensaje: error.message
      };
    }
  }

  // Obtener todas las solicitudes (administradores)
  @Get('todas')
  async obtenerTodas() {
    try {
      return await this.solicitudesRutaService.obtenerTodasLasSolicitudes();
    } catch (error) {
      return {
        exito: false,
        mensaje: error.message
      };
    }
  }
}
