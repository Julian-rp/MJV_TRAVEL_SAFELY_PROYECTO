import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RutaService } from './ruta.service';
import { CreateRutaDto } from './dto/create-ruta.dto';
import { UpdateRutaDto } from './dto/update-ruta.dto';
import { exitCode } from 'process';

@Controller('ruta')
export class RutaController {
  this: any;
  constructor(private readonly rutaService: RutaService) {}

  @Post()
  async create(@Body() body:any) {
    try {
      const result = await this.rutaService.create(body);
      return {
        exito: true,
        mensaje: 'Ruta creada correctamente',
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
    return this.rutaService.findAll(
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rutaService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body:any) {
    try {
      const result = await this.rutaService.update(+id, body);
      return {
        exito: true,
        mensaje: "Ruta actualizada correctamente",
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
    return this.rutaService.remove(+id);
  }
}
