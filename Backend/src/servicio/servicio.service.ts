import { Injectable } from '@nestjs/common';
import { CreateServicioDto } from './dto/create-servicio.dto';
import { UpdateServicioDto } from './dto/update-servicio.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ServicioService {

  constructor(
    private prisma: PrismaService
  ) {}

  create (body:any) {
    return this.prisma.servicio.create({
      data: body
    })
  }
  
  findAll() {
    return this.prisma.servicio.findMany({
      orderBy: [{Id_servicio: 'asc'}]
    });
  }

  findOne(id: number) {
    return this.prisma.servicio.findFirst({
      where:{Id_servicio: id}
    });
  }

  async update(id: number,
          body: any) {
    return await this.prisma.servicio.update({
      where: {Id_servicio: id},
      data: body
    });
  }

  async remove(id: number) {
    await this.prisma.servicio.delete({
      where: {Id_servicio: id}
    });
    return {
      "exito" : true,
      "mensaje" : "Eliminado correctamente ",
      "id" : id 
    }
  }
}
