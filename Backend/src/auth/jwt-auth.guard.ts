import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from './public.decorator';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Permitir rutas públicas si están marcadas con @Public()
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    // Verificar blacklist antes de validar el token
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      
      // Verificar si el token está en la blacklist
      const blacklistedToken = await this.prisma.token_blacklist.findFirst({
        where: {
          token,
          expiresAt: {
            gt: new Date()
          }
        }
      });

      if (blacklistedToken) {
        throw new UnauthorizedException('Token invalidado. Por favor, inicia sesión nuevamente.');
      }
    }

    return super.canActivate(context) as Promise<boolean>;
  }
}

