import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Interceptor que agrega automáticamente campos de auditoría (createdBy, updatedBy)
 * a las operaciones de create y update.
 * 
 * Nota: Este interceptor está preparado pero requiere implementación en los servicios
 * para que funcione automáticamente. Por ahora, los servicios deben agregar manualmente
 * estos campos usando el usuario del request.
 */
@Injectable()
export class AuditInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Si hay un usuario autenticado, agregar información de auditoría al request
    if (user) {
      request.auditUser = {
        id: user.id_usuario,
        nombre: user.nom_completo,
      };
    }

    return next.handle().pipe(
      map((data) => {
        // Aquí se puede agregar lógica adicional después de la respuesta
        return data;
      }),
    );
  }
}

