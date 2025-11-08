# Frontend - Travel Safely

## Estructura del Proyecto

El frontend está organizado siguiendo las mejores prácticas de React:

```
Frontend/
├── public/           # Archivos estáticos (imágenes, etc.)
├── src/
│   ├── components/  # Componentes reutilizables
│   │   ├── Navbar.jsx
│   │   ├── FormularioModal.jsx
│   │   └── Notification.jsx
│   ├── pages/       # Páginas/vistas principales
│   │   ├── Index.jsx
│   │   ├── IniciarSesion.jsx
│   │   ├── Registrate.jsx
│   │   ├── AdminDashboard.jsx
│   │   └── ...
│   ├── services/    # Servicios API (comunicación con backend)
│   │   └── api.js
│   ├── utils/       # Funciones utilitarias
│   │   ├── auth.js
│   │   └── validation.js
│   ├── config/      # Configuración y constantes
│   │   └── constants.js
│   ├── styles/      # Archivos CSS
│   ├── App.jsx      # Componente principal
│   └── main.jsx     # Punto de entrada
└── package.json
```

## Características

- ✅ **Arquitectura modular**: Separación clara entre componentes, páginas, servicios y utilidades
- ✅ **Servicios centralizados**: Todas las llamadas API están en `services/api.js`
- ✅ **Validaciones reutilizables**: Funciones de validación en `utils/validation.js`
- ✅ **Gestión de autenticación**: Utilidades para manejo de usuarios en `utils/auth.js`
- ✅ **Configuración centralizada**: URLs y constantes en `config/constants.js`

## Configuración

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto Frontend:

```env
VITE_API_BASE_URL=http://localhost:3000
```

Si no se especifica, usará `http://localhost:3000` por defecto.

## Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview
```

## Servicios API

### Autenticación
```javascript
import { authService } from '../services/api';

// Login
await authService.login(correo, contrasena);

// Registro de empleado
await authService.registroEmpleado(datos);
```

### Usuarios, Rutas, Empresas
```javascript
import { usuariosService, rutasService, empresasService } from '../services/api';

// Obtener todos
await usuariosService.getAll();

// Crear
await usuariosService.create(datos);

// Actualizar
await usuariosService.update(id, datos);

// Eliminar
await usuariosService.delete(id);
```

## Utilidades

### Autenticación
```javascript
import { saveUser, getUser, removeUser, isAuthenticated, isAdmin } from '../utils/auth';
```

### Validación
```javascript
import { validateEmail, validatePasswordLength, validateDateRange } from '../utils/validation';
```

## Mejoras Implementadas

1. ✅ Unificación de carpetas (`components` en lugar de `components` y `componentes`)
2. ✅ Renombrado de componentes (`nadvar.jsx` → `Navbar.jsx`)
3. ✅ Extracción de llamadas API a servicios centralizados
4. ✅ Configuración centralizada de URLs
5. ✅ Validaciones reutilizables
6. ✅ Utilidades para gestión de autenticación
7. ✅ Eliminación de archivos innecesarios

