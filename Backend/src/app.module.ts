import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RutaModule } from './rutas/ruta.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { ServicioModule } from './servicio/servicio.module';
import { EmpresaModule } from './empresa/empresa.module';
import { AsesorRutaModule } from './asesor_ruta/asesor_ruta.module';
import { ParadaModule } from './parada/parada.module';
import { PatrocinadorModule } from './patrocinador/patrocinador.module';
import { RutaServicioModule } from './ruta_servicio/ruta_servicio.module';
import { AuthModule } from './auth/auth.module';
import { SeedService } from './seed/seed.service';
import { SolicitudesRutaModule } from './solicitudes-ruta/solicitudes-ruta.module';
import { EmailModule } from './email/email.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { RolesGuard } from './auth/roles.guard';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';

@Module({
  imports: [
    // Configurar Rate Limiting - Protección contra fuerza bruta
    ThrottlerModule.forRoot([{
      ttl: 60000, // 1 minuto
      limit: 10, // 10 solicitudes por minuto
    }]),
    RutaModule, 
    PrismaModule, 
    UsuariosModule, 
    ServicioModule, 
    EmpresaModule, 
    AsesorRutaModule, 
    ParadaModule, 
    PatrocinadorModule, 
    RutaServicioModule, 
    AuthModule, 
    SolicitudesRutaModule, 
    EmailModule
  ],
  controllers: [AppController],
  providers: [
    AppService, 
    SeedService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard, // Aplicar rate limiting globalmente
    },
  ],
})
export class AppModule {}
