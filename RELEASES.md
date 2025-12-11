# Cómo Crear una Nueva Release

Este documento explica cómo crear y publicar nuevas versiones de CLIB_Llantas.

## Proceso Manual de Release

### 1. Actualizar la Versión

Primero, actualiza el número de versión en `package.json`:

```bash
npm version patch  # Para versiones de corrección (1.0.3 -> 1.0.4)
npm version minor  # Para nuevas características (1.0.3 -> 1.1.0)
npm version major  # Para cambios importantes (1.0.3 -> 2.0.0)
```

Esto automáticamente:
- Actualiza la versión en `package.json` y `package-lock.json`
- Crea un commit de git
- Crea un tag de git con el formato `vX.Y.Z`

### 2. Compilar la Aplicación

Genera los instaladores de Windows:

```bash
npm run dist
```

Esto creará en la carpeta `dist/`:
- `CLIB Ventas-X.Y.Z-setup.exe` - Instalador NSIS
- `CLIB Ventas-X.Y.Z-x64.exe` - Versión portable

**Nota**: Los nombres de archivo contienen espacios. Al usar la línea de comandos, escapa los espacios con `\` (ejemplo: `CLIB\ Ventas-1.0.4-setup.exe`).

### 3. Publicar en GitHub

#### Opción A: Usando la Interfaz Web de GitHub

1. Ve a la página del repositorio en GitHub
2. Haz clic en "Releases" en la barra lateral derecha
3. Haz clic en "Draft a new release"
4. Selecciona el tag que se creó (por ejemplo, `v1.0.4`)
5. Escribe un título para la release (por ejemplo, "Version 1.0.4")
6. Describe los cambios en el campo de descripción
7. Arrastra y suelta los archivos de `dist/` a la sección de assets
8. Haz clic en "Publish release"

#### Opción B: Usando GitHub CLI (gh)

```bash
# Primero, sube el tag
git push origin main --tags

# Luego crea la release
gh release create v1.0.4 \
  --title "Version 1.0.4" \
  --notes "Descripción de los cambios" \
  dist/CLIB\ Ventas-1.0.4-setup.exe \
  dist/CLIB\ Ventas-1.0.4-x64.exe
```

## Proceso Automatizado con GitHub Actions

Si el archivo `.github/workflows/release.yml` existe, el proceso está automatizado:

1. Actualiza la versión localmente:
   ```bash
   npm version patch
   ```

2. Sube los cambios y el tag:
   ```bash
   git push origin main --tags
   ```

3. GitHub Actions automáticamente:
   - Compilará la aplicación
   - Creará la release
   - Subirá los instaladores

## Actualizaciones Automáticas

La aplicación incluye un sistema de actualizaciones automáticas usando `electron-updater`:

### Cómo Funciona

1. **Al iniciar la aplicación**: Después de 3 segundos, la app verifica si hay una nueva versión disponible en GitHub Releases
2. **Notificación**: Si hay una actualización, aparece un diálogo preguntando si deseas descargarla
3. **Descarga**: Se descarga en segundo plano con barra de progreso
4. **Instalación**: Al terminar, puedes reiniciar inmediatamente o esperar al cerrar la aplicación

### Requisitos para Actualizaciones Automáticas

- La aplicación debe estar instalada con el instalador NSIS (no funciona con versión portable)
- Debe haber una release publicada en GitHub con los archivos y el archivo `latest.yml`
- La versión de la release debe ser mayor que la versión instalada

### Para los Usuarios

Los usuarios no necesitan hacer nada especial. La aplicación:
- Verifica automáticamente al iniciar
- Muestra un diálogo amigable cuando hay actualizaciones
- Permite elegir cuándo instalar (ahora o al cerrar)
- Muestra el progreso de la descarga en la barra de tareas

## Notas de Versión

Al crear una release, incluye:

- **Nuevas características**: Funcionalidades agregadas
- **Correcciones**: Bugs arreglados
- **Cambios**: Modificaciones en comportamiento existente
- **Dependencias**: Actualizaciones de librerías

### Ejemplo de Notas de Versión

```markdown
## Cambios en v1.0.4

### Nuevas características
- Agregado soporte para múltiples instancias de Aspel SAE

### Correcciones
- Corregido error al guardar campos libres vacíos
- Mejorado el manejo de errores de conexión a Firebird

### Cambios
- Actualizada la interfaz de búsqueda de documentos
```

## Consideraciones

- **Versión Semántica**: Seguimos [SemVer](https://semver.org/lang/es/)
  - MAJOR: Cambios incompatibles en la API
  - MINOR: Nueva funcionalidad compatible con versiones anteriores
  - PATCH: Correcciones de bugs compatibles

- **Testing**: Prueba la aplicación antes de crear una release
  - Verifica que `npm run web` funciona correctamente
  - Verifica que `npm start` abre la ventana de Electron
  - Prueba los instaladores generados en una máquina limpia

- **Assets**: Los nombres de archivos en `dist/` incluirán automáticamente la versión configurada en `package.json`
