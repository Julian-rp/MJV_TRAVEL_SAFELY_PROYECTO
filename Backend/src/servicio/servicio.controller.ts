import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ServicioService } from './servicio.service';
import { CreateServicioDto } from './dto/create-servicio.dto';
import { UpdateServicioDto } from './dto/update-servicio.dto';
import { exitCode } from 'process';

@Controller('servicio')
export class ServicioController {
  this: any 
  constructor(private readonly servicioService: ServicioService) {}

  @Post()
  create(@Body() body:any) {
    return this.servicioService.create(Body);
  }

  @Get()
  findAll() {
    return this.servicioService.findAll(
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.servicioService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string,
        @Body() body:any) {
    return {
      "exito" : true,
      "mensaje" : "Actualizado correctamente ",
      "id" : id,
      "data": this.servicioService.update(+id, body)
    };
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.servicioService.remove(+id);
  }
}
