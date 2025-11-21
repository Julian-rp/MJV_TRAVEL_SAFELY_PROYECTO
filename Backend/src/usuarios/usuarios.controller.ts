import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { exitCode } from 'process';

@Controller('usuarios')
export class UsuariosController {
  this: any;
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  async create(@Body() body:any) {
    try {
      const result = await this.usuariosService.create(body);
      return {
        exito: true,
        mensaje: 'Usuario creado correctamente',
        data: result
      };
    } catch (error) {
      return {
        exito: false,
        mensaje: error.message
      };
    }
  }

  @Get()
  findAll() {
    return this.usuariosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usuariosService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body:any) {
    try {
      const result = await this.usuariosService.update(+id, body);
      return {
        exito: true,
        mensaje: "Usuario actualizado correctamente",
        id: id,
        data: result
      };
    } catch (error) {
      return {
        exito: false,
        mensaje: error.message
      };
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usuariosService.remove(+id);
  }
}
