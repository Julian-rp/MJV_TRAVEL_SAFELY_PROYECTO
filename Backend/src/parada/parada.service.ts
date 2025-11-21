import { Injectable } from '@nestjs/common';
import { CreateParadaDto } from './dto/create-parada.dto';
import { UpdateParadaDto } from './dto/update-parada.dto';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class ParadaService {

  constructor(
    private prisma: PrismaService 
  ) {}

  create(body: any) {
    return this.prisma.parada.create({
      data: body
    })
  }

  findAll() {
    return this.prisma.parada.findMany({
      orderBy: [{ Id_parada: 'asc' }]
    })
  }

  findOne(id: number) {
    return this.prisma.parada.findFirst({
      where: { Id_parada: id }
    }) 
  }

  async update(id: number, body: any) {
    return await this.prisma.parada.update({
      where: { Id_parada: id },
      data: body
    });
  }

  async remove(id: number) {
    await this.prisma.parada.delete({
      where: { Id_parada: id }
    })
    return {
      "exito": true,
      "mensaje": "Eliminado correctamente",
      "id": id 
    }
  }
}
