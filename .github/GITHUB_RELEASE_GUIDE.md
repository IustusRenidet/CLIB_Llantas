# Guía Rápida: Crear Release en GitHub

Esta guía te muestra paso a paso cómo crear una release directamente en GitHub.

## Pasos

### 1. Preparar el Código Local

```bash
# Asegúrate de estar en la rama principal
git checkout main
git pull origin main

# Actualiza la versión (ejemplo: de 1.0.3 a 1.0.4)
npm version patch

# Esto creará:
# - Un commit con el cambio de versión
# - Un tag git con formato v1.0.4
```

### 2. Subir los Cambios

```bash
# Sube el commit y el tag
git push origin main
git push origin --tags
```

### 3. Esperar a que GitHub Actions Compile

Una vez que subas el tag, GitHub Actions automáticamente:
- Instalará las dependencias
- Compilará la aplicación
- Creará una release draft con los instaladores

Puedes ver el progreso en: `https://github.com/IustusRenidet/CLIB_Llantas/actions`

### 4. Editar y Publicar la Release

1. Ve a: `https://github.com/IustusRenidet/CLIB_Llantas/releases`
2. Verás una nueva release creada automáticamente
3. Haz clic en "Edit" para agregar:
   - Título: `Version X.Y.Z`
   - Descripción: Usa el template de `.github/RELEASE_TEMPLATE.md`
4. Revisa que los archivos `.exe` estén adjuntos
5. Haz clic en "Publish release"

## Proceso Manual (Sin Workflow)

Si prefieres no usar el workflow automático:

### 1. Compilar Localmente

```bash
npm run dist
```

### 2. Crear Release Manualmente en GitHub

1. Ve a `https://github.com/IustusRenidet/CLIB_Llantas/releases`
2. Haz clic en "Draft a new release"
3. En "Choose a tag", selecciona el tag o crea uno nuevo (ejemplo: `v1.0.4`)
4. En "Release title", escribe: `Version 1.0.4`
5. En "Describe this release", escribe las notas de versión
6. En "Attach binaries", arrastra y suelta los archivos de `dist/`:
   - `CLIB Ventas-1.0.4-setup.exe`
   - `CLIB Ventas-1.0.4-x64.exe`
7. Haz clic en "Publish release"

## Verificación

Después de publicar:

1. Verifica que la release aparezca en: `https://github.com/IustusRenidet/CLIB_Llantas/releases`
2. Verifica que los archivos sean descargables
3. Opcionalmente, descarga y prueba los instaladores

## Troubleshooting

### El workflow no se ejecuta
- Verifica que el tag tenga formato `vX.Y.Z` (ejemplo: `v1.0.4`)
- Verifica en Actions si hay errores

### La compilación falla
- Verifica que todas las dependencias estén en `package.json`
- Verifica que el build local funcione: `npm run dist`

### Los archivos no se suben
- Verifica que los permisos del `GITHUB_TOKEN` incluyan `contents: write`
- Verifica que los archivos `.exe` existan en `dist/`
