import { Injectable } from '@nestjs/common';
import { CreateRutaDto } from './dto/create-ruta.dto';
import { UpdateRutaDto } from './dto/update-ruta.dto';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class RutaService {

  constructor(
    private prisma: PrismaService 
  ) {}

  async create(body: any) {
    try {
      // Convertir tipos de datos correctamente
      const data = {
        ...body,
        Id_conductor: body.Id_conductor ? parseInt(body.Id_conductor) : (body.Id_usuario ? parseInt(body.Id_usuario) : null),
        // Convertir fechas al formato correcto para Prisma
        Hora_Salida: body.Hora_Salida ? new Date(body.Hora_Salida) : new Date(),
        Hora_Entrada: body.Hora_Entrada ? new Date(body.Hora_Entrada) : new Date()
      };
      
      // Eliminar Id_usuario si existe ya que ahora usamos Id_conductor
      delete data.Id_usuario;
      
      return await this.prisma.ruta.create({
        data
      });
    } catch (error) {
      console.error('Error creating ruta:', error);
      throw new Error('Error al crear la ruta: ' + error.message);
    }
  }

  findAll() {
    return this.prisma.ruta.findMany({
      include: {
        ruta_empleado: {
          include: {
            usuario: true
          }
        },
        conductor: true
      },
      orderBy: [{Id_ruta: 'asc'}]
    })
  }

  findOne(id: number) {
    return this.prisma.ruta.findFirst({
      where: { Id_ruta: id },
      include: {
        ruta_empleado: {
          include: {
            usuario: true
          }
        },
        conductor: true,
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
    }) 
  }

  async update(id: number, body: any) {
    try {
      // Filtrar campos que no se pueden actualizar
      const { Id_ruta, conductor, asesor_ruta, ruta_servicio, ruta_empleado, solicitudes_ruta, ...updateData } = body;
      
      // Convertir tipos de datos correctamente
      const data = {
        ...updateData,
        Id_conductor: updateData.Id_conductor ? parseInt(updateData.Id_conductor) : (updateData.Id_usuario ? parseInt(updateData.Id_usuario) : undefined),
        // Convertir fechas al formato correcto para Prisma si están presentes
        Hora_Salida: updateData.Hora_Salida ? new Date(updateData.Hora_Salida) : undefined,
        Hora_Entrada: updateData.Hora_Entrada ? new Date(updateData.Hora_Entrada) : undefined
      };
      
      // Eliminar Id_usuario si existe ya que ahora usamos Id_conductor
      delete data.Id_usuario;
      
      return await this.prisma.ruta.update({
        where: { Id_ruta: id },
        data
      });
    } catch (error) {
      console.error('Error updating ruta:', error);
      throw new Error('Error al actualizar la ruta: ' + error.message);
    }
  }

  async remove(id: number) {
    await this.prisma.ruta.delete({
      where: {Id_ruta: id}
    })
    return{
      "exito" : true,
      "mensaje" : "Eliminado correctamente ",
      "id" : id 
    }
  }
}
