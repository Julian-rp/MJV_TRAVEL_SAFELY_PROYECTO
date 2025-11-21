import { PartialType } from '@nestjs/mapped-types';
import { CreateAsesorRutaDto } from './create-asesor_ruta.dto';

export class UpdateAsesorRutaDto extends PartialType(CreateAsesorRutaDto) {}
