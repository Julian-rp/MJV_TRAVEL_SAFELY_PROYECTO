import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PatrocinadorService } from './patrocinador.service';
import { CreatePatrocinadorDto } from './dto/create-patrocinador.dto';
import { UpdatePatrocinadorDto } from './dto/update-patrocinador.dto';
import { exitCode } from 'process';

@Controller('patrocinador')
export class PatrocinadorController {
  this: any;
  constructor(private readonly patrocinadorService: PatrocinadorService) {}

  @Post()
  create(@Body() body: any) {
    return this.patrocinadorService.create(body);
  }

  @Get()
  findAll() {
    return this.patrocinadorService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.patrocinadorService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return {
      "exito": true,
      "mensaje": "Actualizado correctamente",
      "id": id,
      "data": this.patrocinadorService.update(+id, body)
    };
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.patrocinadorService.remove(+id);
  }
}