# 🚌 Travel Safely - Sistema de Gestión de Rutas y Transporte

Sistema completo de gestión de rutas de transporte para empresas, con dashboards específicos para diferentes tipos de usuarios (Administrador, Conductor, Empleado, Asesor de Ruta, Patrocinador).

## 📋 Características Principales

### 🔒 Seguridad
- ✅ Encriptación de contraseñas con bcrypt
- ✅ Autenticación JWT con expiración
- ✅ Guards de autenticación y autorización
- ✅ Protección contra XSS/CSRF (Helmet, CORS)
- ✅ Rate Limiting para login (protección contra fuerza bruta)
- ✅ Invalidación de tokens al cerrar sesión (blacklist)
- ✅ Restablecimiento de contraseña por email

### 📊 Funcionalidades
- ✅ Gestión de usuarios (CRUD completo)
- ✅ Gestión de rutas y vehículos
- ✅ Solicitudes de rutas por empleados
- ✅ Asignación de rutas por conductores
- ✅ Dashboard para cada tipo de usuario
- ✅ Auditoría de acciones críticas (createdBy, updatedBy)
- ✅ Documentación API con Swagger

### 🎨 Frontend
- ✅ Interfaz moderna y responsive
- ✅ Breadcrumbs de navegación
- ✅ Tablas con paginación, filtros y ordenamiento
- ✅ Componentes reutilizables
- ✅ Validación de formularios
- ✅ Política de Privacidad y Términos y Condiciones

### 📧 Emails
- ✅ Email de bienvenida al iniciar sesión
- ✅ Email de restablecimiento de contraseña
- ✅ Integración con EmailJS

## 🏗️ Estructura del Proyecto

```
MJV_PROYECTO_TARVEL/
├── Backend/          # API REST con NestJS
│   ├── src/          # Código fuente
│   ├── prisma/       # Esquema de base de datos
│   └── README.md     # Documentación del backend
│
├── Frontend/         # Aplicación React
│   ├── src/          # Código fuente
│   └── README.md     # Documentación del frontend
│
├── CHECKLIST_ACTUALIZADO.md    # Checklist de funcionalidades
└── MEJORAS_IMPLEMENTADAS.md    # Documentación de mejoras
```

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js (v18 o superior)
- MySQL (v8 o superior)
- npm o yarn

### Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd MJV_PROYECTO_TARVEL
```

2. **Configurar Backend**

```bash
cd Backend
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de MySQL

# Generar cliente de Prisma
npx prisma generate

# Aplicar migraciones
npx prisma db push

# Iniciar servidor (modo desarrollo)
npm run start:dev
```

3. **Configurar Frontend**

```bash
cd Frontend
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con la URL del backend

# Iniciar aplicación (modo desarrollo)
npm run dev
```

### Variables de Entorno

#### Backend (.env)
```env
DATABASE_URL="mysql://user:password@localhost:3306/travel_safely"
JWT_SECRET="tu-secret-key-muy-segura"
PORT=3000
FRONTEND_URL="http://localhost:5173"

# SMTP (Opcional - si no se configura, se usa EmailJS desde el frontend)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASS=tu-contraseña-de-aplicación
```

#### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:3000
VITE_EMAILJS_SERVICE_ID=tu-service-id
VITE_EMAILJS_TEMPLATE_ID=tu-template-id
VITE_EMAILJS_TEMPLATE_ID_BIENVENIDA=tu-template-bienvenida
VITE_EMAILJS_PUBLIC_KEY=tu-public-key
```

## 📚 Documentación

### Backend
- **API Documentation (Swagger)**: http://localhost:3000/api
- **README**: Ver `Backend/README.md`

### Frontend
- **README**: Ver `Frontend/README.md`

### Configuración
- **Configurar Gmail SMTP**: Ver `Backend/CONFIGURAR_GMAIL.md`
- **Configurar EmailJS**: Ver `Backend/INSTRUCCIONES_SMTP.md`

## 🧪 Testing

### Backend
```bash
cd Backend
npm run test          # Unit tests
npm run test:e2e      # E2E tests
npm run test:cov      # Coverage
```

### Frontend
```bash
cd Frontend
npm run test          # Tests (si están configurados)
```

## 🏗️ Build para Producción

### Backend
```bash
cd Backend
npm run build
npm run start:prod
```

### Frontend
```bash
cd Frontend
npm run build
# Los archivos estarán en Frontend/dist/
```

## 📝 Scripts Disponibles

### Backend
- `npm run start` - Iniciar servidor
- `npm run start:dev` - Modo desarrollo (watch)
- `npm run start:prod` - Modo producción
- `npm run build` - Compilar TypeScript
- `npm run test` - Ejecutar tests

### Frontend
- `npm run dev` - Servidor de desarrollo
- `npm run build` - Build para producción
- `npm run preview` - Preview del build

## 🔧 Tecnologías Utilizadas

### Backend
- **NestJS** - Framework Node.js
- **Prisma** - ORM para base de datos
- **MySQL** - Base de datos
- **JWT** - Autenticación
- **bcrypt** - Encriptación de contraseñas
- **Swagger** - Documentación API
- **Throttler** - Rate limiting

### Frontend
- **React** - Librería UI
- **React Router** - Navegación
- **Vite** - Build tool
- **EmailJS** - Envío de emails
- **Leaflet** - Mapas

## 📊 Base de Datos

El esquema de la base de datos está definido en `Backend/prisma/schema.prisma`.

### Modelos Principales
- `usuarios` - Usuarios del sistema
- `empresa` - Empresas
- `ruta` - Rutas de transporte
- `solicitud_ruta` - Solicitudes de rutas
- `token_blacklist` - Tokens invalidados
- `password_reset_token` - Tokens de restablecimiento

## 🔐 Seguridad

- ✅ Contraseñas hasheadas con bcrypt
- ✅ Tokens JWT con expiración
- ✅ Rate limiting en endpoints sensibles
- ✅ Protección CSRF/XSS
- ✅ Validación de datos de entrada
- ✅ Blacklist de tokens

## 📋 Checklist de Funcionalidades

Ver `CHECKLIST_ACTUALIZADO.md` para el estado completo de todas las funcionalidades.

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 👥 Autores

- **Equipo de Desarrollo** - *Desarrollo inicial*

## 🙏 Agradecimientos

- NestJS por el excelente framework
- Prisma por el ORM intuitivo
- React por la librería de UI

---

**Última actualización**: 2024-11-07

