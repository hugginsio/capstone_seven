import { app, BrowserWindow, dialog, webFrame } from 'electron';
import { protocol } from 'electron';
import * as path from 'path';
import * as url from 'url';

let window: BrowserWindow;
const args = process.argv.slice(1);
const serve = args.some(val => val === '--serve');
const isDev = !app.isPackaged;

function createWindow(): BrowserWindow {
  const WEB_FOLDER = '../dist/';
  const PROTOCOL = 'file';

  protocol.interceptFileProtocol(PROTOCOL, (req: Electron.ProtocolRequest, callback: any) => {
    let url = req.url.substr(PROTOCOL.length + 1);
    url = path.join(__dirname, WEB_FOLDER, url);
    url = path.normalize(url);
    callback({ path: url });
  });

  window = new BrowserWindow({
    center: true,
    fullscreenable: true,
    height: 884,
    minHeight: 884,
    minWidth: 1280,
    resizable: true,
    width: 1280,
    webPreferences: {
      allowRunningInsecureContent: (serve) ? true : false,
      contextIsolation: false,
      devTools: isDev,
      enableRemoteModule : true,
      nodeIntegration: true,
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
      pathname: 'index.html',
      protocol: PROTOCOL,
      slashes: true
    }));
  }

  if (process.platform !== 'darwin' || !isDev) {
    window.removeMenu();
  }

  window.on('close', (event) => {
    event.preventDefault();
    dialog.showMessageBox(window, {
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

  // window.setFullScreen(true);
  window.maximize();

  return window;
}

app.commandLine.appendSwitch('disable-autoplay-policy', 'no-user-gesture-required');

app.on('ready', () => setTimeout(createWindow, 400));

app.on('window-all-closed', () => {
  app.quit();
});

app.on('activate', () => {
  createWindow();
  webFrame.setZoomFactor(1);
  webFrame.setVisualZoomLevelLimits(1, 1);
});