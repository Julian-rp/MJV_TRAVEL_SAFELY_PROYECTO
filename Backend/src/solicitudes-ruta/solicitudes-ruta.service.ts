import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SolicitudesRutaService {
  constructor(private prisma: PrismaService) {}

  // Crear una nueva solicitud de ruta
  async crearSolicitud(idUsuario: number, datos: any, createdBy?: number) {
    try {
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
        Hora_Salida: datos.horaSalida ? new Date(datos.horaSalida) : null,
        Hora_Entrada: datos.horaEntrada ? new Date(datos.horaEntrada) : null,
        Observaciones: datos.observaciones || null,
        Estado: 'Pendiente'
      };

      // Nota: Los campos createdBy y updatedBy se agregarán cuando el cliente de Prisma se regenere
      // Por ahora, no los incluimos para evitar errores de validación

      const solicitud = await this.prisma.solicitud_ruta.create({
        data: datosSolicitud,
        include: {
          usuario: true
        }
      });

      return {
        exito: true,
        mensaje: 'Solicitud de ruta creada correctamente',
        data: solicitud
      };
    } catch (error) {
      console.error('Error completo al crear solicitud:', error);
      console.error('Detalles:', {
        code: error.code,
        meta: error.meta,
        message: error.message
      });
      throw new Error('Error al crear la solicitud: ' + error.message);
    }
  }

  // Obtener todas las solicitudes pendientes (para conductores)
  async obtenerSolicitudesPendientes() {
    try {
      const solicitudes = await this.prisma.solicitud_ruta.findMany({
        where: {
          Estado: 'Pendiente'
        },
        include: {
          usuario: {
            select: {
              id_usuario: true,
              Nom_completo: true,
              Telefono: true,
              Correo: true,
              direccion: true,
              Tip_usuario: true
            }
          }
        },
        orderBy: {
          FechaSolicitud: 'desc'
        }
      });

      return {
        exito: true,
        mensaje: 'Solicitudes obtenidas correctamente',
        data: solicitudes
      };
    } catch (error) {
      throw new Error('Error al obtener solicitudes: ' + error.message);
    }
  }

  // Obtener solicitudes de un usuario específico con información completa
  async obtenerSolicitudesPorUsuario(idUsuario: number) {
    try {
      const solicitudes = await this.prisma.solicitud_ruta.findMany({
        where: {
          Id_usuario: idUsuario
        },
        include: {
          ruta: {
            include: {
              ruta_empleado: {
                include: {
                  usuario: true
                }
              }
            }
          }
        },
        orderBy: {
          FechaSolicitud: 'desc'
        }
      });

      return {
        exito: true,
        mensaje: 'Solicitudes obtenidas correctamente',
        data: solicitudes
      };
    } catch (error) {
      throw new Error('Error al obtener solicitudes: ' + error.message);
    }
  }

  // Aceptar una solicitud y crear la ruta (conductor)
  async aceptarSolicitud(idSolicitud: number, idConductor: number, datosRuta: any) {
    try {
      // Verificar que el conductor existe
      const conductor = await this.prisma.usuarios.findUnique({
        where: { id_usuario: idConductor }
      });

      if (!conductor) {
        return {
          exito: false,
          mensaje: 'Usuario no encontrado'
        };
      }

      // Validar que sea conductor (permitir variaciones comunes)
      const tipoConductor = conductor.Tip_usuario?.toLowerCase().trim();
      const esConductor = tipoConductor === 'conductor' || 
                         tipoConductor === 'conductor de ruta' ||
                         tipoConductor.includes('conductor');

      if (!esConductor) {
        return {
          exito: false,
          mensaje: `El usuario no es un conductor válido. Tipo actual: ${conductor.Tip_usuario}. Por favor, verifica que el usuario tenga el rol de "Conductor" en el sistema.`
        };
      }

      // Obtener la solicitud
      const solicitud = await this.prisma.solicitud_ruta.findUnique({
        where: { Id_solicitud: idSolicitud },
        include: { usuario: true }
      });

      if (!solicitud) {
        return {
          exito: false,
          mensaje: 'Solicitud no encontrada'
        };
      }

      if (solicitud.Estado !== 'Pendiente') {
        return {
          exito: false,
          mensaje: 'La solicitud ya fue procesada'
        };
      }

      // Buscar una ruta existente del conductor con espacio disponible
      const rutasExistentes = await this.prisma.ruta.findMany({
        where: {
          Id_conductor: idConductor
        },
        include: {
          ruta_empleado: true // Contar empleados asignados
        }
      });

      // Encontrar una ruta con espacio disponible
      let rutaParaAsignar: any = null;
      for (const ruta of rutasExistentes) {
        const empleadosAsignados = ruta.ruta_empleado.length;
        const capacidad = ruta.Capacidad || 20;
        if (empleadosAsignados < capacidad) {
          rutaParaAsignar = ruta;
          break;
        }
      }

      // Si no hay ruta con espacio, crear una nueva
      if (!rutaParaAsignar) {
        rutaParaAsignar = await this.prisma.ruta.create({
          data: {
            Placas: datosRuta.placas || 'SIN PLACA',
            Marca: datosRuta.marca || null,
            Capacidad: datosRuta.capacidad || 20,
            Papeles_Vehiculo: datosRuta.papelesVehiculo || null,
            Direccion_Encuentro: datosRuta.direccionEncuentro || solicitud.Direccion || null,
            Hora_Salida: datosRuta.horaSalida ? new Date(datosRuta.horaSalida) : (solicitud.Hora_Salida || new Date()),
            Hora_Entrada: datosRuta.horaEntrada ? new Date(datosRuta.horaEntrada) : (solicitud.Hora_Entrada || new Date()),
            Id_conductor: idConductor
          }
        });
      }

      // Verificar que rutaParaAsignar no sea null (para TypeScript)
      if (!rutaParaAsignar || !rutaParaAsignar.Id_ruta) {
        return {
          exito: false,
          mensaje: 'Error al crear o encontrar la ruta'
        };
      }

      // Verificar si el empleado ya está asignado a esta ruta
      const asignacionExistente = await this.prisma.ruta_empleado.findFirst({
        where: {
          Id_ruta: rutaParaAsignar.Id_ruta,
          Id_usuario: solicitud.Id_usuario
        }
      });

      if (asignacionExistente) {
        return {
          exito: false,
          mensaje: 'Este empleado ya está asignado a esta ruta'
        };
      }

      // Asignar el empleado a la ruta
      await this.prisma.ruta_empleado.create({
        data: {
          Id_ruta: rutaParaAsignar.Id_ruta,
          Id_usuario: solicitud.Id_usuario
        }
      });

      // Actualizar la solicitud
      const solicitudActualizada = await this.prisma.solicitud_ruta.update({
        where: { Id_solicitud: idSolicitud },
        data: {
          Estado: 'Aceptada',
          Id_conductor: idConductor,
          Id_ruta: rutaParaAsignar.Id_ruta,
          FechaRespuesta: new Date()
        },
        include: {
          usuario: true,
          ruta: {
            include: {
              ruta_empleado: {
                include: {
                  usuario: true
                }
              }
            }
          }
        }
      });

      return {
        exito: true,
        mensaje: 'Solicitud aceptada y ruta creada correctamente',
        data: solicitudActualizada
      };
    } catch (error) {
      throw new Error('Error al aceptar la solicitud: ' + error.message);
    }
  }

  // Rechazar una solicitud
  async rechazarSolicitud(idSolicitud: number, idConductor: number, motivo?: string) {
    try {
      const solicitud = await this.prisma.solicitud_ruta.findUnique({
        where: { Id_solicitud: idSolicitud }
      });

      if (!solicitud) {
        return {
          exito: false,
          mensaje: 'Solicitud no encontrada'
        };
      }

      if (solicitud.Estado !== 'Pendiente') {
        return {
          exito: false,
          mensaje: 'La solicitud ya fue procesada'
        };
      }

      const solicitudActualizada = await this.prisma.solicitud_ruta.update({
        where: { Id_solicitud: idSolicitud },
        data: {
          Estado: 'Rechazada',
          Id_conductor: idConductor,
          Observaciones: motivo || solicitud.Observaciones,
          FechaRespuesta: new Date()
        }
      });

      return {
        exito: true,
        mensaje: 'Solicitud rechazada correctamente',
        data: solicitudActualizada
      };
    } catch (error) {
      throw new Error('Error al rechazar la solicitud: ' + error.message);
    }
  }

  // Obtener todas las solicitudes (para administradores)
  async obtenerTodasLasSolicitudes() {
    try {
      const solicitudes = await this.prisma.solicitud_ruta.findMany({
        include: {
          usuario: {
            select: {
              id_usuario: true,
              Nom_completo: true,
              Telefono: true,
              Correo: true,
              Tip_usuario: true
            }
          },
          ruta: true
        },
        orderBy: {
          FechaSolicitud: 'desc'
        }
      });

      return {
        exito: true,
        mensaje: 'Solicitudes obtenidas correctamente',
        data: solicitudes
      };
    } catch (error) {
      throw new Error('Error al obtener solicitudes: ' + error.message);
    }
  }
}
