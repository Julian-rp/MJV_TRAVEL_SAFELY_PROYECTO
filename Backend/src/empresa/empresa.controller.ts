import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EmpresaService } from './empresa.service';
import { CreateEmpresaDto } from './dto/create-empresa.dto';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';

@Controller('empresa')
export class EmpresaController {
  constructor(private readonly empresaService: EmpresaService) {}

  @Post()
  async create(@Body() createEmpresaDto: CreateEmpresaDto) {
    try {
      const result = await this.empresaService.create(createEmpresaDto);
      return {
        exito: true,
        mensaje: 'Empresa creada correctamente',
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
    return this.empresaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.empresaService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateEmpresaDto: UpdateEmpresaDto) {
    try {
      const result = await this.empresaService.update(+id, updateEmpresaDto);
      return {
        exito: true,
        mensaje: "Empresa actualizada correctamente",
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
    return this.empresaService.remove(+id);
  }
}