import { Module } from '@nestjs/common';
import { SolicitudesRutaService } from './solicitudes-ruta.service';
import { SolicitudesRutaController } from './solicitudes-ruta.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SolicitudesRutaController],
  providers: [SolicitudesRutaService],
  exports: [SolicitudesRutaService]
})
export class SolicitudesRutaModule {}
