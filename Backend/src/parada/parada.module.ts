import { Module } from '@nestjs/common';
import { ParadaService } from './parada.service';
import { ParadaController } from './parada.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ParadaController],
  providers: [ParadaService],
})
export class ParadaModule {}
