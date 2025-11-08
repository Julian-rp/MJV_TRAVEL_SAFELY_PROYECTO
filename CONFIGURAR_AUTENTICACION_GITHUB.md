# 🔐 Configurar Autenticación con GitHub

## ⚠️ Problema

GitHub ya no acepta contraseñas para operaciones Git. Necesitas usar un **Personal Access Token (PAT)** o **SSH**.

## 🚀 Solución Rápida: Personal Access Token (PAT)

### Paso 1: Crear un Personal Access Token

1. **Ve a GitHub.com** e inicia sesión
2. **Haz clic en tu foto de perfil** (arriba derecha)
3. **Selecciona "Settings"**
4. **En el menú lateral, baja hasta "Developer settings"**
5. **Clic en "Personal access tokens" → "Tokens (classic)"**
6. **Clic en "Generate new token" → "Generate new token (classic)"**
7. **Configura el token:**
   - **Note**: `Travel Safely Project` (o cualquier nombre descriptivo)
   - **Expiration**: Elige una duración (90 días, 1 año, o sin expiración)
   - **Select scopes**: Marca estas opciones:
     - ✅ `repo` (acceso completo a repositorios)
     - ✅ `workflow` (si usas GitHub Actions)
8. **Clic en "Generate token"**
9. **⚠️ IMPORTANTE: Copia el token inmediatamente** (solo se muestra una vez)
   - Se verá algo como: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### Paso 2: Usar el Token para hacer Push

**Opción A: Usar el token en la URL (temporal)**

```bash
git push https://ghp_TU_TOKEN_AQUI@github.com/Julian-rp/MJV_TRAVEL_SAFELY_PROYECTO.git main
```

**Opción B: Configurar Git Credential Manager (Recomendado)**

1. **Windows**: Git Credential Manager debería estar instalado con Git
2. **La primera vez que hagas push**, Git te pedirá:
   - **Username**: `Julian-rp` (tu usuario de GitHub)
   - **Password**: **Pega el token** (no tu contraseña)

**Opción C: Guardar el token en Git Credential Manager**

```bash
# Guardar credenciales
git credential-manager-core store

# O usar:
git config --global credential.helper manager-core
```

Luego cuando hagas `git push`, te pedirá:
- Username: `Julian-rp`
- Password: `ghp_tu_token_aqui`

### Paso 3: Hacer Push

```bash
git push -u origin main
```

---

## 🔑 Alternativa: Usar SSH (Más Seguro)

### Paso 1: Generar una clave SSH

```bash
# Generar clave SSH (si no tienes una)
ssh-keygen -t ed25519 -C "tu-email@example.com"

# Presiona Enter para aceptar la ubicación por defecto
# Opcionalmente, agrega una contraseña para mayor seguridad
```

### Paso 2: Agregar la clave SSH a GitHub

1. **Copia tu clave pública:**
   ```bash
   # Windows (Git Bash)
   cat ~/.ssh/id_ed25519.pub
   
   # O usando clip
   clip < ~/.ssh/id_ed25519.pub
   ```

2. **En GitHub:**
   - Ve a **Settings** → **SSH and GPG keys**
   - Clic en **"New SSH key"**
   - **Title**: `Mi Computadora` (o cualquier nombre)
   - **Key**: Pega la clave pública
   - Clic en **"Add SSH key"**

### Paso 3: Cambiar el remote a SSH

```bash
# Cambiar remote de HTTPS a SSH
git remote set-url origin git@github.com:Julian-rp/MJV_TRAVEL_SAFELY_PROYECTO.git

# Verificar
git remote -v
```

### Paso 4: Hacer Push

```bash
git push -u origin main
```

---

## 📋 Resumen de Opciones

### Opción 1: Personal Access Token (Más Fácil)
- ✅ Fácil de configurar
- ✅ Funciona inmediatamente
- ⚠️ El token expira (depende de la configuración)
- ⚠️ Menos seguro que SSH

### Opción 2: SSH (Más Seguro)
- ✅ Más seguro
- ✅ No expira
- ✅ Más conveniente a largo plazo
- ⚠️ Requiere configuración inicial

---

## 🆘 Solución de Problemas

### Error: "Authentication failed"

**Solución:**
- Verifica que el token sea correcto
- Asegúrate de copiar el token completo (empieza con `ghp_`)
- Si usas SSH, verifica que la clave esté agregada a GitHub

### Error: "Permission denied"

**Solución:**
- Verifica que el token tenga el scope `repo`
- Verifica que tengas permisos en el repositorio

### Git pide contraseña constantemente

**Solución:**
```bash
# Configurar Git Credential Manager
git config --global credential.helper manager-core

# O para Windows:
git config --global credential.helper wincred
```

---

## ✅ Verificación

Después de configurar, verifica que funciona:

```bash
git push -u origin main
```

Si funciona, verás algo como:
```
Enumerating objects: X, done.
Counting objects: 100% (X/X), done.
Writing objects: 100% (X/X), done.
To https://github.com/Julian-rp/MJV_TRAVEL_SAFELY_PROYECTO.git
 * [new branch]      main -> main
```

---

**¡Listo! Una vez configurado, podrás hacer push sin problemas.** 🚀

