import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RutaServicioService } from './ruta_servicio.service';
import { CreateRutaServicioDto } from './dto/create-ruta_servicio.dto';
import { UpdateRutaServicioDto } from './dto/update-ruta_servicio.dto';
import { exitCode } from 'process';

@Controller('ruta_servicio')
export class RutaServicioController {
  this: any;
  constructor(private readonly rutaServicioService: RutaServicioService) {}

  @Post()
  create(@Body() body: any) {
    return this.rutaServicioService.create(body);
  }

  @Get()
  findAll() {
    return this.rutaServicioService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rutaServicioService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return {
      "exito": true,
      "mensaje": "Actualizado correctamente",
      "id": id,
      "data": this.rutaServicioService.update(+id, body)
    };
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rutaServicioService.remove(+id);
  }
}
