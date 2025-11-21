import { Module } from '@nestjs/common';
import { AsesorRutaService } from './asesor_ruta.service';
import { AsesorRutaController } from './asesor_ruta.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AsesorRutaController],
  providers: [AsesorRutaService],
})
export class AsesorRutaModule {}
