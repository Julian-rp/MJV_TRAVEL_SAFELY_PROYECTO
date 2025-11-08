# 🔧 Solución: Error en GitHub Actions

## ⚠️ Problema

El workflow "Deploy to GitHub Pages" está fallando. Necesitamos revisar los logs para identificar el error específico.

## 🔍 Pasos para Diagnosticar

### 1. Ver los Logs del Error

1. **Ve a tu repositorio en GitHub**
2. **Clic en la pestaña "Actions"**
3. **Clic en el workflow que falló** (el que tiene el ❌ rojo)
4. **Clic en el job que falló** (probablemente "build")
5. **Revisa los logs** para ver el error específico

### 2. Errores Comunes y Soluciones

#### Error: "package-lock.json not found"

**Solución:**
```bash
# En tu máquina local
cd Frontend
npm install
git add package-lock.json
git commit -m "Add package-lock.json"
git push origin main
```

#### Error: "npm ci failed"

**Solución:**
- El workflow ya está actualizado para usar `npm install` si no existe `package-lock.json`
- O genera el `package-lock.json` localmente

#### Error: "Build failed"

**Posibles causas:**
1. **Variables de entorno faltantes:**
   - Verifica que el secret `VITE_API_BASE_URL` esté configurado en GitHub
   - O actualiza el valor por defecto en el workflow

2. **Errores en el código:**
   - Revisa que el proyecto compile localmente:
   ```bash
   cd Frontend
   npm run build
   ```

3. **Dependencias faltantes:**
   - Verifica que `package.json` tenga todas las dependencias necesarias

#### Error: "Permission denied" o "Pages write access"

**Solución:**
1. **Ve a Settings → Pages**
2. **Verifica que "Source" esté en "GitHub Actions"**
3. **Verifica permisos del workflow:**
   - El workflow ya tiene `pages: write` y `id-token: write`
   - Si el error persiste, verifica los permisos del repositorio

#### Error: "Path not found: Frontend/dist"

**Solución:**
- Verifica que el build genere la carpeta `dist`
- El workflow ya está configurado para buscar en `./Frontend/dist`

## 🛠️ Solución Rápida

### Opción 1: Generar package-lock.json

```bash
cd Frontend
npm install
git add package-lock.json
git commit -m "Add package-lock.json for GitHub Actions"
git push origin main
```

### Opción 2: Actualizar el Workflow

El workflow ya está actualizado para manejar la ausencia de `package-lock.json`. 

Si el problema persiste, puedes forzar la ejecución manualmente:

1. **Ve a Actions → Deploy to GitHub Pages**
2. **Clic en "Run workflow"**
3. **Selecciona la rama "main"**
4. **Clic en "Run workflow"**

### Opción 3: Verificar Build Localmente

Antes de hacer push, verifica que el build funcione:

```bash
cd Frontend
npm install
npm run build
```

Si el build falla localmente, corrige los errores antes de hacer push.

## 📋 Checklist de Verificación

- [ ] `package-lock.json` existe en `Frontend/`
- [ ] El build funciona localmente (`npm run build`)
- [ ] El secret `VITE_API_BASE_URL` está configurado en GitHub (opcional)
- [ ] GitHub Pages está configurado con "Source: GitHub Actions"
- [ ] El workflow tiene los permisos correctos

## 🔄 Workflow Actualizado

He actualizado el workflow para:
- ✅ Manejar la ausencia de `package-lock.json`
- ✅ Usar `npm install` como fallback
- ✅ Mantener la caché de npm si existe `package-lock.json`

## 📝 Próximos Pasos

1. **Genera `package-lock.json`** (si no existe):
   ```bash
   cd Frontend
   npm install
   git add package-lock.json
   git commit -m "Add package-lock.json"
   git push origin main
   ```

2. **Verifica que el build funcione localmente:**
   ```bash
   cd Frontend
   npm run build
   ```

3. **Haz push de los cambios:**
   ```bash
   git add .
   git commit -m "Fix GitHub Actions workflow"
   git push origin main
   ```

4. **Revisa los logs en GitHub Actions** para ver si el error se solucionó

## 🆘 Si el Error Persiste

1. **Comparte el error específico** de los logs de GitHub Actions
2. **Verifica que todas las dependencias estén en `package.json`**
3. **Revisa que el código compile sin errores localmente**

---

**¡El workflow debería funcionar correctamente después de estos pasos!** 🚀

