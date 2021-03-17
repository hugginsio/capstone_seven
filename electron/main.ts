import { app, BrowserWindow, dialog, webFrame } from 'electron';
import * as path from 'path';
import * as url from 'url';

let window: BrowserWindow;
const args = process.argv.slice(1);
const serve = args.some(val => val === '--serve');
const isDev = !app.isPackaged;

function createWindow(): BrowserWindow {
  window = new BrowserWindow({
    width: 1280,
    height: 884,
    minWidth: 1280,
    minHeight: 884,
    resizable: true,
    center: true,
    webPreferences: {
      nodeIntegration: true,
      allowRunningInsecureContent: (serve) ? true : false,
      contextIsolation: false,
      enableRemoteModule : true,
      devTools: isDev,
      zoomFactor: 1
    },
  });

  if (serve) {
    if (isDev) {
      window.webContents.openDevTools();
    }

    require('electron-reload')(__dirname, {
      electron: require(`${__dirname}/../node_modules/electron`)
    });

    window.loadURL('http://localhost:4200');

  } else {
    window.loadURL(url.format({
      pathname: path.join(__dirname, '../dist/index.html'),
      protocol: 'file:',
      slashes: true
    }));
  }

  if (process.platform !== 'darwin' || !isDev) {
    window.removeMenu();
  }

  window.on('close', (event) => {
    event.preventDefault();
    dialog.showMessageBox({
      type: 'warning',
      buttons: ['Cancel', 'Quit'],
      title: 'Warning',
      message: 'Are you sure you want to quit?',
      cancelId: 0,
      defaultId: 1,
      noLink: true
    }).then((val) => {
      if (val.response === 1) {
        app.exit();
      }
    });
  });

  window.on('closed', () => {
    app.quit();
  });

  return window;
}

app.on('ready', () => setTimeout(createWindow, 400));

app.on('window-all-closed', () => {
  app.quit();
});

app.on('activate', () => {
  createWindow();
  webFrame.setZoomFactor(1);
  webFrame.setVisualZoomLevelLimits(1, 1);
});