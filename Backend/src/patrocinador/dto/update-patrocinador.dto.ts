import { PartialType } from '@nestjs/mapped-types';
import { CreatePatrocinadorDto } from './create-patrocinador.dto';

export class UpdatePatrocinadorDto extends PartialType(CreatePatrocinadorDto) {}
