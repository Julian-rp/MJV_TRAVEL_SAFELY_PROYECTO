import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TokenBlacklistInterceptor implements NestInterceptor {
  constructor(private prisma: PrismaService) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
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

    return next.handle();
  }
}

