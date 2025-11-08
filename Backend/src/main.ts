import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { SeedService } from './seed/seed.service';
import { EmailService } from './email/email.service';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configurar Swagger para documentación API
  const config = new DocumentBuilder()
    .setTitle('Travel Safely API')
    .setDescription('API para el sistema de gestión de rutas y transporte')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
  console.log('📚 Documentación Swagger disponible en: http://localhost:3000/api');
  
  // Verificar configuración de email al iniciar (no bloquea el inicio si falla)
  try {
    const emailService = app.get(EmailService);
    await emailService.verificarConexion();
  } catch (error) {
    console.warn('⚠️ Advertencia: No se pudo verificar la conexión de email. Los emails se enviarán desde el frontend con EmailJS.');
    console.warn('   Error:', error.message);
  }
  
  // Configurar Helmet para protección contra XSS y otros ataques
  app.use(helmet.default({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    crossOriginEmbedderPolicy: false, // Permitir iframes si es necesario
  }));
  
  // Configurar CORS de forma más segura
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Solo permitir origen del frontend
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // Permitir cookies si es necesario
  });
  
  // Validación global de datos (sanitización automática)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Eliminar propiedades que no están en el DTO
      forbidNonWhitelisted: true, // Lanzar error si hay propiedades no permitidas
      transform: true, // Transformar tipos automáticamente
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  
  // Ejecutar seed al iniciar la aplicación
  try {
    const seedService = app.get(SeedService);
    await seedService.seed();
  } catch (error) {
    console.error('❌ Error al ejecutar seed. Verifica que MySQL esté corriendo:', error.message);
    console.error('   Asegúrate de que MySQL esté iniciado en el puerto 3306');
  }
  
  await app.listen(process.env.PORT ?? 3000);
  console.log(`🚀 Servidor ejecutándose en http://localhost:${process.env.PORT ?? 3000}`);
}
bootstrap();
