# 🚀 Paso a Paso: Subir Página a GitHub Pages

## 📋 Resumen del Proceso

1. ✅ Autenticarse con GitHub (Token o SSH)
2. ✅ Subir código a GitHub
3. ✅ Configurar GitHub Pages
4. ✅ Desplegar backend (Vercel)
5. ✅ Actualizar URLs
6. ✅ Verificar que funcione

---

## 🔐 PASO 1: Autenticarse con GitHub

### Opción A: Personal Access Token (Recomendado para empezar)

1. **Ve a GitHub.com** e inicia sesión
2. **Clic en tu foto de perfil** → **Settings**
3. **Baja hasta "Developer settings"** (al final del menú lateral)
4. **Clic en "Personal access tokens" → "Tokens (classic)"**
5. **"Generate new token" → "Generate new token (classic)"**
6. **Configura:**
   - **Note**: `Travel Safely Project`
   - **Expiration**: Elige (90 días o más)
   - **Scopes**: Marca ✅ `repo` y ✅ `workflow`
7. **"Generate token"**
8. **⚠️ COPIA EL TOKEN** (solo se muestra una vez)
   - Se ve así: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### Opción B: SSH (Más seguro a largo plazo)

```bash
# 1. Generar clave SSH
ssh-keygen -t ed25519 -C "tu-email@example.com"
# Presiona Enter para aceptar ubicación por defecto

# 2. Copiar clave pública
cat ~/.ssh/id_ed25519.pub
# O en Windows:
clip < ~/.ssh/id_ed25519.pub

# 3. En GitHub: Settings → SSH and GPG keys → New SSH key
# Pega la clave y guarda

# 4. Cambiar remote a SSH
git remote set-url origin git@github.com:Julian-rp/MJV_TRAVEL_SAFELY_PROYECTO.git
```

---

## 📤 PASO 2: Subir Código a GitHub

### Si usas Token (HTTPS):

```bash
# Desde la terminal en la raíz del proyecto
cd C:/Users/User/Documents/MJV_PROYECTO_TARVEL

# Verificar que todo esté listo
git status

# Hacer push (te pedirá usuario y contraseña)
# Usuario: Julian-rp
# Contraseña: Pega el TOKEN (no tu contraseña de GitHub)
git push -u origin main
```

### Si usas SSH:

```bash
# Hacer push (no pedirá credenciales si SSH está configurado)
git push -u origin main
```

**✅ Si funciona, verás:**
```
Enumerating objects: X, done.
Counting objects: 100% (X/X), done.
Writing objects: 100% (X/X), done.
To https://github.com/Julian-rp/MJV_TRAVEL_SAFELY_PROYECTO.git
 * [new branch]      main -> main
```

---

## ⚙️ PASO 3: Configurar GitHub Pages

1. **Ve a tu repositorio en GitHub:**
   ```
   https://github.com/Julian-rp/MJV_TRAVEL_SAFELY_PROYECTO
   ```

2. **Clic en "Settings"** (Configuración)

3. **En el menú lateral, clic en "Pages"**

4. **En "Source", selecciona:**
   - **Source**: `GitHub Actions` (no "Deploy from a branch")
   
5. **Guarda** (no necesitas hacer nada más, GitHub Actions se ejecutará automáticamente)

6. **Ve a la pestaña "Actions"** de tu repositorio
   - Verás un workflow llamado "Deploy to GitHub Pages"
   - Espera 2-3 minutos a que termine

7. **Cuando termine, tu sitio estará en:**
   ```
   https://julian-rp.github.io/MJV_TRAVEL_SAFELY_PROYECTO/
   ```

---

## 🖥️ PASO 4: Desplegar Backend en Vercel

**⚠️ IMPORTANTE:** El frontend necesita conectarse a un backend. GitHub Pages solo sirve archivos estáticos.

### 4.1 Crear cuenta en Vercel

1. **Ve a [vercel.com](https://vercel.com)**
2. **"Sign Up"** → **"Continue with GitHub"**
3. **Autoriza Vercel** para acceder a tus repositorios

### 4.2 Importar Proyecto

1. **"Add New Project"** (o "Import Project")
2. **Selecciona tu repositorio:** `Julian-rp/MJV_TRAVEL_SAFELY_PROYECTO`
3. **Configuración del proyecto:**
   - **Framework Preset**: `Other`
   - **Root Directory**: `Backend` ⚠️ **IMPORTANTE**
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
   - **Override**: Deja por defecto

4. **Variables de Entorno:**
   Clic en "Environment Variables" y agrega:
   
   ```
   DATABASE_URL=mysql://usuario:contraseña@host:3306/travel_safely
   JWT_SECRET=tu-secret-key-muy-segura-y-larga
   PORT=3000
   FRONTEND_URL=https://julian-rp.github.io/MJV_TRAVEL_SAFELY_PROYECTO
   ```
   
   **⚠️ IMPORTANTE:** 
   - Reemplaza `DATABASE_URL` con tu conexión real a MySQL
   - Para producción, necesitarás una base de datos en la nube (PlanetScale, Railway DB, etc.)

5. **"Deploy"**

6. **Espera 2-3 minutos** a que termine el deploy

7. **Copia la URL** que te da Vercel:
   - Se verá así: `https://mjt-travel-safely-proyecto.vercel.app`
   - **Guarda esta URL**, la necesitarás en el siguiente paso

---

## 🔗 PASO 5: Actualizar URL del Backend

### 5.1 Actualizar constants.js

**Archivo:** `Frontend/src/config/constants.js`

Busca estas líneas (alrededor de la línea 11-13):

```javascript
? 'https://tu-backend.vercel.app' // ⚠️ CAMBIA ESTO
```

**Reemplázalas con tu URL real de Vercel:**

```javascript
? 'https://mjt-travel-safely-proyecto.vercel.app' // Tu URL de Vercel
```

**Ejemplo completo:**
```javascript
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  (isProduction && isGitHubPages
    ? 'https://mjt-travel-safely-proyecto.vercel.app' // ⬅️ Tu URL aquí
    : isProduction
    ? 'https://mjt-travel-safely-proyecto.vercel.app' // ⬅️ Tu URL aquí
    : 'http://localhost:3000');
```

### 5.2 Agregar Secret en GitHub (para GitHub Actions)

1. **Ve a tu repositorio → Settings → Secrets and variables → Actions**
2. **"New repository secret"**
3. **Name**: `VITE_API_BASE_URL`
4. **Secret**: `https://mjt-travel-safely-proyecto.vercel.app` (tu URL de Vercel)
5. **"Add secret"**

### 5.3 Actualizar CORS en Backend

**Archivo:** `Backend/src/main.ts`

Busca la sección de CORS (alrededor de la línea 60):

```typescript
app.enableCors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  // ...
});
```

**Actualízala para incluir GitHub Pages:**

```typescript
app.enableCors({
  origin: [
    'http://localhost:5173',
    'https://julian-rp.github.io',  // ⬅️ Agrega esta línea
    process.env.FRONTEND_URL || 'http://localhost:5173'
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
});
```

### 5.4 Hacer Commit y Push de los Cambios

```bash
# Agregar cambios
git add Frontend/src/config/constants.js Backend/src/main.ts

# Commit
git commit -m "Update backend URL for production"

# Push
git push origin main
```

---

## ✅ PASO 6: Verificar que Todo Funcione

### 6.1 Verificar Frontend en GitHub Pages

1. **Ve a:** `https://julian-rp.github.io/MJV_TRAVEL_SAFELY_PROYECTO/`
2. **Deberías ver** la página principal
3. **Abre la consola del navegador** (F12)
4. **Verifica que no haya errores** de conexión con el backend

### 6.2 Verificar Backend en Vercel

1. **Ve a:** `https://tu-backend.vercel.app/api`
2. **Deberías ver** la documentación Swagger
3. **Prueba hacer login** desde el frontend desplegado

### 6.3 Verificar GitHub Actions

1. **Ve a tu repositorio → Actions**
2. **Verifica que el workflow "Deploy to GitHub Pages"** haya terminado exitosamente
3. **Si hay errores**, revisa los logs

---

## 🔄 PASO 7: Actualizaciones Futuras

Cada vez que quieras actualizar el sitio:

```bash
# 1. Hacer cambios en tu código

# 2. Agregar cambios
git add .

# 3. Commit
git commit -m "Descripción de los cambios"

# 4. Push
git push origin main

# 5. GitHub Actions se ejecutará automáticamente
# 6. En 2-3 minutos, los cambios estarán en GitHub Pages
```

---

## 🆘 Solución de Problemas

### Problema: Página en blanco

**Solución:**
- Verifica que `base` en `vite.config.js` sea `/MJV_TRAVEL_SAFELY_PROYECTO/`
- Abre la consola del navegador (F12) y revisa errores
- Verifica que GitHub Actions haya terminado exitosamente

### Problema: Errores 404 en rutas

**Solución:**
- El archivo `404.html` ya está configurado
- Verifica que esté en `Frontend/public/404.html`

### Problema: API no funciona

**Solución:**
- Verifica que el backend esté desplegado en Vercel
- Verifica que la URL en `constants.js` sea correcta
- Verifica CORS en `Backend/src/main.ts`
- Revisa la consola del navegador para errores específicos

### Problema: GitHub Actions falla

**Solución:**
1. Ve a tu repositorio → Actions
2. Clic en el workflow que falló
3. Revisa los logs del error
4. Verifica que:
   - El secret `VITE_API_BASE_URL` esté configurado
   - Los paths en el workflow sean correctos

### Problema: Backend no inicia en Vercel

**Solución:**
- Verifica que `Root Directory` sea `Backend`
- Verifica que las variables de entorno estén configuradas
- Revisa los logs de Vercel para ver el error específico
- Verifica que `DATABASE_URL` sea correcta

---

## 📋 Checklist Final

Antes de considerar el deploy completo:

- [ ] Código subido a GitHub exitosamente
- [ ] GitHub Pages configurado (Source: GitHub Actions)
- [ ] GitHub Actions ejecutado exitosamente
- [ ] Backend desplegado en Vercel
- [ ] Variables de entorno configuradas en Vercel
- [ ] URL del backend actualizada en `constants.js`
- [ ] Secret `VITE_API_BASE_URL` agregado en GitHub
- [ ] CORS actualizado en backend
- [ ] Frontend accesible en GitHub Pages
- [ ] Backend accesible en Vercel
- [ ] Login funciona desde el sitio desplegado
- [ ] API funciona correctamente

---

## 🔗 URLs Finales

Después de completar todos los pasos:

- **Frontend (GitHub Pages):**
  ```
  https://julian-rp.github.io/MJV_TRAVEL_SAFELY_PROYECTO/
  ```

- **Backend (Vercel):**
  ```
  https://tu-backend.vercel.app
  ```

- **Documentación API (Swagger):**
  ```
  https://tu-backend.vercel.app/api
  ```

---

## 📝 Notas Importantes

1. **GitHub Pages es gratuito** para repositorios públicos
2. **Vercel es gratuito** para proyectos personales
3. **Base de datos en producción:** Necesitarás un servicio como:
   - PlanetScale (gratis hasta cierto límite)
   - Railway DB
   - Render DB
   - DigitalOcean
4. **Las variables de entorno** deben configurarse en cada servicio
5. **Los cambios pueden tardar 2-3 minutos** en reflejarse

---

**¡Éxito con tu deploy! 🚀**

Si tienes problemas en algún paso, revisa la sección "Solución de Problemas" o los logs de GitHub Actions/Vercel.

