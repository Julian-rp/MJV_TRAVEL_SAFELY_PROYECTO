import { IsEmail, IsNotEmpty } from 'class-validator';

export class SolicitarRestablecimientoDto {
  @IsEmail({}, { message: 'Debe ser un correo electrónico válido' })
  @IsNotEmpty({ message: 'El correo es requerido' })
  correo: string;
}


