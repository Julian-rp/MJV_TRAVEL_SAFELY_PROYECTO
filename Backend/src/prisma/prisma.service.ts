import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from '../../generated/prisma';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit , OnModuleDestroy  {
  private _usuarios: any;
  public get usuarios(): any {
    return this._usuarios;
  }
  public set usuarios(value: any) {
    this._usuarios = value;
  }
  private _ruta: any;
  public get ruta(): any {
    return this._ruta;
  }
  public set ruta(value: any) {
    this._ruta = value;
  }

 async onModuleInit() {
   try {
     await this.$connect();
     console.log('✅ Conexión a la base de datos establecida correctamente');
   } catch (error) {
     console.error('❌ Error al conectar con la base de datos:', error.message);
     console.error('   Verifica que:');
     console.error('   1. MySQL esté corriendo en el puerto 3306');
     console.error('   2. Las credenciales en DATABASE_URL sean correctas');
     console.error('   3. La base de datos exista');
     console.error('   4. El formato del DATABASE_URL sea: mysql://usuario:contraseña@localhost:3306/nombre_db');
     throw error; // Re-lanzar el error para que NestJS lo maneje
   }
 }

 async onModuleDestroy() {
   await this.$disconnect();
 }

}
