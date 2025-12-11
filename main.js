const { app, BrowserWindow } = require('electron');
const { iniciarServidor, detenerServidor, PUERTO_SERVIDOR } = require('./server');
const path = require('path');

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
