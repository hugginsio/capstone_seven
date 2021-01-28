import { app, BrowserWindow, screen } from 'electron';
import * as path from 'path';
import * as url from 'url';

let window: BrowserWindow = null;
const args = process.argv.slice(1), serve = args.some(val => val === '--serve');
const isDev = process.env.NODE_ENV === 'development';

function createWindow(): BrowserWindow {

  const electronScreen = screen;
  const display = electronScreen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  window = new BrowserWindow({
    width: display.width / 2,
    height: (display.height / 3) * 2,
    minWidth: display.width / 2,
    minHeight: (display.height / 3) * 2,
    resizable: true,
    center: true,
    webPreferences: {
      nodeIntegration: true,
      allowRunningInsecureContent: (serve) ? true : false,
      contextIsolation: false,
      enableRemoteModule : true
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

  window.on('closed', () => {
    window = null;
  });

  return window;
}

app.on('ready', () => setTimeout(createWindow, 400));

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  app.quit();
});

app.on('activate', () => {
  createWindow();
});