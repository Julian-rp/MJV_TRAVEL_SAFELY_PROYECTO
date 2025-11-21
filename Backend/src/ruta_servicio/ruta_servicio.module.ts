import { Module } from '@nestjs/common';
import { RutaServicioService } from './ruta_servicio.service';
import { RutaServicioController } from './ruta_servicio.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [RutaServicioController],
  providers: [RutaServicioService],
})
export class RutaServicioModule {}
