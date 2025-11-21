import { Module } from '@nestjs/common';
import { PatrocinadorService } from './patrocinador.service';
import { PatrocinadorController } from './patrocinador.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PatrocinadorController],
  providers: [PatrocinadorService],
})
export class PatrocinadorModule {}
