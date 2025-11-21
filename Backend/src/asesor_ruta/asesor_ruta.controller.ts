import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AsesorRutaService } from './asesor_ruta.service';
import { CreateAsesorRutaDto } from './dto/create-asesor_ruta.dto';
import { UpdateAsesorRutaDto } from './dto/update-asesor_ruta.dto';
import { exitCode } from 'process';

@Controller('asesor_ruta')
export class AsesorRutaController {
  this: any;
  constructor(private readonly asesorRutaService: AsesorRutaService) {}

  @Post()
  create(@Body() body: any) {
    return this.asesorRutaService.create(body);
  }

  @Get()
  findAll() {
    return this.asesorRutaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.asesorRutaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return {
      "exito": true,
      "mensaje": "Actualizado correctamente",
      "id": id,
      "data": this.asesorRutaService.update(+id, body)
    };
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.asesorRutaService.remove(+id);
  }
}
