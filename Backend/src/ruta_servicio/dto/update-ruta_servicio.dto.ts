import { PartialType } from '@nestjs/mapped-types';
import { CreateRutaServicioDto } from './create-ruta_servicio.dto';

export class UpdateRutaServicioDto extends PartialType(CreateRutaServicioDto) {}
