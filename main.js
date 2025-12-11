const { app, BrowserWindow } = require('electron');
const { autoUpdater } = require('electron-updater');
const { iniciarServidor, detenerServidor, PUERTO_SERVIDOR } = require('./server');
const path = require('path');

// Configurar el autoUpdater para desarrollo y producción
autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = true;

// Permitir múltiples instancias
app.requestSingleInstanceLock = () => false;

// Aislar el perfil de cada instancia con un ID único
const instanceId = Date.now() + '-' + Math.random().toString(36).substr(2, 9);
const userDataPath = path.join(app.getPath('userData'), 'instances', instanceId);
app.setPath('userData', userDataPath);

let ventanaPrincipal = null;

async function crearVentana() {
  await iniciarServidor();

  ventanaPrincipal = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 640,
    title: 'CLIB Ventas',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  });

  await ventanaPrincipal.loadURL(`http://localhost:${PUERTO_SERVIDOR}`);
}

app.whenReady().then(async () => {
  try {
    await crearVentana();
    
    // Verificar actualizaciones después de que la ventana esté lista
    // Solo en producción (no en desarrollo)
    if (!app.isPackaged) {
      console.log('Modo desarrollo: actualizaciones deshabilitadas');
    } else {
      setTimeout(() => {
        autoUpdater.checkForUpdates();
      }, 3000); // Esperar 3 segundos después de iniciar
    }
  } catch (error) {
    console.error('No fue posible iniciar la aplicación:', error);
    app.quit();
  }

  app.on('activate', async () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      await crearVentana();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', async () => {
  await detenerServidor();
});

// Eventos del autoUpdater
autoUpdater.on('checking-for-update', () => {
  console.log('Verificando actualizaciones...');
});

autoUpdater.on('update-available', (info) => {
  console.log('Actualización disponible:', info.version);
  const { dialog } = require('electron');
  
  dialog.showMessageBox(ventanaPrincipal, {
    type: 'info',
    title: 'Actualización disponible',
    message: `Nueva versión ${info.version} disponible`,
    detail: '¿Deseas descargar e instalar la actualización ahora? La aplicación se cerrará para completar la instalación.',
    buttons: ['Descargar e instalar', 'Más tarde'],
    defaultId: 0,
    cancelId: 1
  }).then((result) => {
    if (result.response === 0) {
      autoUpdater.downloadUpdate();
    }
  });
});

autoUpdater.on('update-not-available', () => {
  console.log('La aplicación está actualizada');
});

autoUpdater.on('error', (err) => {
  console.error('Error al verificar actualizaciones:', err);
});

autoUpdater.on('download-progress', (progressObj) => {
  const percent = Math.round(progressObj.percent);
  console.log(`Descargando actualización: ${percent}%`);
  if (ventanaPrincipal) {
    ventanaPrincipal.setProgressBar(percent / 100);
  }
});

autoUpdater.on('update-downloaded', (info) => {
  console.log('Actualización descargada:', info.version);
  if (ventanaPrincipal) {
    ventanaPrincipal.setProgressBar(-1); // Remover barra de progreso
  }
  
  const { dialog } = require('electron');
  dialog.showMessageBox(ventanaPrincipal, {
    type: 'info',
    title: 'Actualización lista',
    message: 'La actualización se ha descargado correctamente',
    detail: 'La aplicación se reiniciará para aplicar la actualización.',
    buttons: ['Reiniciar ahora', 'Reiniciar al cerrar'],
    defaultId: 0,
    cancelId: 1
  }).then((result) => {
    if (result.response === 0) {
      autoUpdater.quitAndInstall(false, true);
    }
  });
});
