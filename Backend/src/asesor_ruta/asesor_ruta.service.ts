import { Injectable } from '@nestjs/common';
import { CreateAsesorRutaDto } from './dto/create-asesor_ruta.dto';
import { UpdateAsesorRutaDto } from './dto/update-asesor_ruta.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AsesorRutaService {

  constructor(
    private prisma: PrismaService 
  ) {}

  create(body: any) {
    return this.prisma.asesor_ruta.create({
      data: body
    })
  }

  findAll() {
    return this.prisma.asesor_ruta.findMany({
      orderBy: [{ Id_asesor: 'asc' }]
    })
  }

  findOne(id: number) {
    return this.prisma.asesor_ruta.findFirst({
      where: { Id_asesor: id }
    }) 
  }

  async update(id: number, body: any) {
    return await this.prisma.asesor_ruta.update({
      where: { Id_asesor: id },
      data: body
    });
  }

  async remove(id: number) {
    await this.prisma.asesor_ruta.delete({
      where: { Id_asesor: id }
    })
    return {
      "exito": true,
      "mensaje": "Eliminado correctamente",
      "id": id 
    }
  }
}
