import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ParadaService } from './parada.service';
import { CreateParadaDto } from './dto/create-parada.dto';
import { UpdateParadaDto } from './dto/update-parada.dto';
import { exitCode } from 'process';

@Controller('parada')
export class ParadaController {
  this: any;
  constructor(private readonly paradaService: ParadaService) {}

  @Post()
  create(@Body() body: any) {
    return this.paradaService.create(body);
  }

  @Get()
  findAll() {
    return this.paradaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paradaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return {
      "exito": true,
      "mensaje": "Actualizado correctamente",
      "id": id,
      "data": this.paradaService.update(+id, body)
    };
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paradaService.remove(+id);
  }
}
