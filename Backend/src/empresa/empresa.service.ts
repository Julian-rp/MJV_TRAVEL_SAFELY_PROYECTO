import { Injectable } from '@nestjs/common';
import { CreateEmpresaDto } from './dto/create-empresa.dto';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class EmpresaService {

  constructor(
    private prisma: PrismaService 
  ) {}

  async create(body: any) {
    try {
      return await this.prisma.empresa.create({
        data: body
      });
    } catch (error) {
      console.error('Error creating empresa:', error);
      throw new Error('Error al crear la empresa: ' + error.message);
    }
  }

  findAll() {
    return this.prisma.empresa.findMany({
      orderBy: [{id_empresa: 'asc' }]
    })
  }

  findOne(id: number) {
    return this.prisma.empresa.findFirst({
      where: { id_empresa: id }
    }) 
  }

  async update(id: number, body: any) {
    try {
      // Filtrar campos que no se pueden actualizar
      const { id_empresa, usuarios, patrocinador, ...updateData } = body;
      
      return await this.prisma.empresa.update({
        where: { id_empresa: id },
        data: updateData
      });
    } catch (error) {
      console.error('Error updating empresa:', error);
      throw new Error('Error al actualizar la empresa: ' + error.message);
    }
  }

  async remove(id: number) {
    await this.prisma.empresa.delete({
      where: { id_empresa: id }
    })
    return {
      "exito": true,
      "mensaje": "Eliminado correctamente",
      "id": id
    }
  }
}
