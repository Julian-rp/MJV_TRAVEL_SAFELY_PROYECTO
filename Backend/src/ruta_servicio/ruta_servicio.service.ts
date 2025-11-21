import { Injectable } from '@nestjs/common';
import { CreateRutaServicioDto } from './dto/create-ruta_servicio.dto';
import { UpdateRutaServicioDto } from './dto/update-ruta_servicio.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RutaServicioService {

  constructor(
    private prisma: PrismaService 
  ) {}

  create(body: any) {
    return this.prisma.ruta_servicio.create({
      data: body
    })
  }

  findAll() {
    return this.prisma.ruta_servicio.findMany({
      orderBy: [{ Id_ruta_servicio: 'asc' }]
    })
  }

  findOne(id: number) {
    return this.prisma.ruta_servicio.findFirst({
      where: { Id_ruta_servicio: id }
    }) 
  }

  async update(id: number, body: any) {
    return await this.prisma.ruta_servicio.update({
      where: { Id_ruta_servicio: id },
      data: body
    });
  }

  async remove(id: number) {
    await this.prisma.ruta_servicio.delete({
      where: { Id_ruta_servicio: id }
    })
    return {
      "exito": true,
      "mensaje": "Eliminado correctamente",
      "id": id 
    }
  }
}
