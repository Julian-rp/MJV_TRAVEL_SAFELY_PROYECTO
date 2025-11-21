import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SeedService {
  constructor(private prisma: PrismaService) {}

  async seed() {
    // Crear empresa por defecto si no existe
    const empresaExistente = await this.prisma.empresa.findFirst();
    
    if (!empresaExistente) {
      await this.prisma.empresa.create({
        data: {
          Tip_empresa: 'Transporte',
          Nom_empresa: 'Travel Safely',
          Direccion: 'Calle Principal #123',
          Correo: 'admin@travelsafely.com'
        }
      });
      console.log('✅ Empresa por defecto creada');
    }

    // Crear algunos servicios de ejemplo
    const serviciosExistentes = await this.prisma.servicio.findMany();
    
    if (serviciosExistentes.length === 0) {
      await this.prisma.servicio.createMany({
        data: [
          {
            Direccion: 'Centro Comercial Plaza Mayor'
          },
          {
            Direccion: 'Universidad Nacional'
          },
          {
            Direccion: 'Hospital Central'
          }
        ]
      });
      console.log('✅ Servicios de ejemplo creados');
    }

    // Crear usuario administrador de prueba
    const usuarioAdmin = await this.prisma.usuarios.findFirst({
      where: { Correo: 'admin@travelsafely.com' }
    });
    
    if (!usuarioAdmin) {
      await this.prisma.usuarios.create({
        data: {
          Tip_usuario: 'Administrador',
          Nom_completo: 'Administrador del Sistema',
          direccion: 'Oficina Principal',
          Correo: 'admin@travelsafely.com',
          Telefono: 1234567890,
          contrasena: 'admin123',
          Id_empresa: 1
        }
      });
      console.log('✅ Usuario administrador creado (admin@travelsafely.com / admin123)');
    }
  }
}
