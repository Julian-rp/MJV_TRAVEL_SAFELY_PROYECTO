import { Injectable, Body } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from 'src/usuarios/dto/update-usuario.dto';  
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsuariosService {

  constructor(
    private prisma: PrismaService 
  ) {}

  async create(body:any) {
    try {
      // Verificar si el correo ya existe
      const existingUser = await this.prisma.usuarios.findFirst({
        where: { Correo: body.Correo }
      });
      
      if (existingUser) {
        throw new Error('El correo electrónico ya está registrado');
      }

      // Convertir tipos de datos correctamente
      const data = {
        ...body,
        Telefono: body.Telefono ? parseInt(body.Telefono) : null,
        Id_empresa: body.Id_empresa ? parseInt(body.Id_empresa) : 1
      };
      
      return await this.prisma.usuarios.create({
        data
      });
    } catch (error) {
      console.error('Error creating usuario:', error);
      throw new Error('Error al crear el usuario: ' + error.message);
    }
  }

  findAll() {
    return this.prisma.usuarios.findMany({
      include: { empresa: true }
    });
  }

  findOne(id: number) {
    return this.prisma.usuarios.findFirst({
      where:{id_usuario:id}
    });
  }

  async update(id: number, body: any) {
    try {
      // Filtrar campos que no se pueden actualizar
      const { id_usuario, empresa, ruta, ...updateData } = body;
      
      // Convertir tipos de datos correctamente
      const data = {
        ...updateData,
        Telefono: updateData.Telefono ? parseInt(updateData.Telefono) : undefined,
        Id_empresa: updateData.Id_empresa ? parseInt(updateData.Id_empresa) : undefined
      };
      
      return await this.prisma.usuarios.update({
        where: { id_usuario: id },
        data
      });
    } catch (error) {
      console.error('Error updating usuario:', error);
      throw new Error('Error al actualizar el usuario: ' + error.message);
    }
  }

  async remove(id: number) {
    await this.prisma.usuarios.delete({
      where: {id_usuario: id}
    });
    return {
      "exito" : true,
      "mensaje" : "Eliminado correctamente ",
      "id" : id
    }
  }
}
