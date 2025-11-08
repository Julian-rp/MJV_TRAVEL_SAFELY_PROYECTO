import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'your-secret-key-change-in-production', // En producción usar variable de entorno
    });
  }

  async validate(payload: any) {
    // El payload contiene los datos que pusimos en el token (id_usuario, correo, etc.)
    const usuario = await this.prisma.usuarios.findUnique({
      where: { id_usuario: payload.sub },
      include: { empresa: true },
    });

    if (!usuario) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    // Retornamos el usuario para que esté disponible en el request
    return {
      id_usuario: usuario.id_usuario,
      correo: usuario.Correo,
      tip_usuario: usuario.Tip_usuario,
      nom_completo: usuario.Nom_completo,
      empresa: usuario.empresa,
    };
  }
}

