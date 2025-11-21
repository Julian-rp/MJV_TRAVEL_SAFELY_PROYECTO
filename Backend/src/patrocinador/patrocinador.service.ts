import { Injectable } from '@nestjs/common';
import { CreatePatrocinadorDto } from './dto/create-patrocinador.dto';
import { UpdatePatrocinadorDto } from './dto/update-patrocinador.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PatrocinadorService {

  constructor(
    private prisma: PrismaService 
  ) {}

  create(body: any) {
    return this.prisma.patrocinador.create({
      data: body
    })
  }

  findAll() {
    return this.prisma.patrocinador.findMany({
      orderBy: [{ Id_patrocina: 'asc' }]
    })
  }

  findOne(id: number) {
    return this.prisma.patrocinador.findFirst({
      where: { Id_patrocina: id }
    }) 
  }

  async update(id: number, body: any) {
    return await this.prisma.patrocinador.update({
      where: { Id_patrocina: id },
      data: body
    });
  }

  async remove(id: number) {
    await this.prisma.patrocinador.delete({
      where: { Id_patrocina: id }
    })
    return {
      "exito": true,
      "mensaje": "Eliminado correctamente",
      "id": id 
    }
  }
}
