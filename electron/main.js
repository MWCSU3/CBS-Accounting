const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');
const net = require('net');

let mainWindow;
let serverProcess;
let serverPort = 3000;

// Get the user data directory for local storage
const userDataPath = app.getPath('userData');
const dataDir = path.join(userDataPath, 'data');
const uploadsDir = path.join(userDataPath, 'uploads');

// Ensure data directories exist
function ensureDirectories() {
  [dataDir, uploadsDir].forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

// Find an available port
function findAvailablePort(startPort) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(startPort, () => {
      const port = server.address().port;
      server.close(() => resolve(port));
    });
    server.on('error', () => {
      resolve(findAvailablePort(startPort + 1));
    });
  });
}

// Start the Next.js standalone server
async function startServer() {
  serverPort = await findAvailablePort(3000);

  // Set environment variables for the server
  const env = {
    ...process.env,
    PORT: String(serverPort),
    CBS_DATA_DIR: dataDir,
    CBS_UPLOADS_DIR: uploadsDir,
    NODE_ENV: 'production',
  };

  // In production (packaged), the standalone server is in resources
  const isPackaged = app.isPackaged;
  const serverDir = isPackaged
    ? path.join(process.resourcesPath, 'standalone')
    : path.join(__dirname, '..', '.next', 'standalone');

  const serverScript = path.join(serverDir, 'server.js');

  if (!fs.existsSync(serverScript)) {
    dialog.showErrorBox(
      'CBS Accounting',
      `Server not found at: ${serverScript}\n\nPlease rebuild the application.`
    );
    app.quit();
    return;
  }

  serverProcess = spawn(process.execPath.includes('electron') ? 'node' : process.execPath, [serverScript], {
    env,
    cwd: serverDir,
    stdio: ['pipe', 'pipe', 'pipe'],
  });

  // Use node directly in packaged mode
  if (isPackaged) {
    serverProcess = spawn('node', [serverScript], {
      env,
      cwd: serverDir,
      stdio: ['pipe', 'pipe', 'pipe'],
    });
  }

  serverProcess.stdout.on('data', (data) => {
    console.log(`[Server] ${data}`);
  });

  serverProcess.stderr.on('data', (data) => {
    console.error(`[Server Error] ${data}`);
  });

  serverProcess.on('error', (err) => {
    console.error('Failed to start server:', err);
  });

  // Wait for server to be ready
  await waitForServer(serverPort);
}

function waitForServer(port, retries = 30) {
  return new Promise((resolve, reject) => {
    const check = (attempt) => {
      const socket = new net.Socket();
      socket.setTimeout(1000);
      socket.on('connect', () => {
        socket.destroy();
        resolve();
      });
      socket.on('timeout', () => {
        socket.destroy();
        if (attempt < retries) {
          setTimeout(() => check(attempt + 1), 500);
        } else {
          reject(new Error('Server did not start in time'));
        }
      });
      socket.on('error', () => {
        if (attempt < retries) {
          setTimeout(() => check(attempt + 1), 500);
        } else {
          reject(new Error('Server did not start in time'));
        }
      });
      socket.connect(port, '127.0.0.1');
    };
    check(0);
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    title: 'CBS Accounting',
    icon: path.join(__dirname, 'icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
    show: false,
    backgroundColor: '#f9fafb',
  });

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.loadURL(`http://127.0.0.1:${serverPort}`);

  // Open external links in browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// IPC Handlers
ipcMain.handle('get-data-path', () => dataDir);
ipcMain.handle('get-uploads-path', () => uploadsDir);

ipcMain.handle('open-file-dialog', async (event, options) => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile', 'multiSelections'],
    filters: [
      { name: 'Documents', extensions: ['pdf', 'jpg', 'jpeg', 'png', 'gif', 'eml', 'csv', 'txt'] },
      { name: 'All Files', extensions: ['*'] },
    ],
    ...options,
  });
  return result;
});

ipcMain.handle('open-folder-dialog', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
  });
  return result;
});

// App lifecycle
app.whenReady().then(async () => {
  ensureDirectories();

  // Show splash/loading
  const splash = new BrowserWindow({
    width: 400,
    height: 300,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: false,
  });
  splash.loadURL(`data:text/html,
    <html>
      <body style="margin:0;display:flex;align-items:center;justify-content:center;height:100vh;background:rgba(255,255,255,0.95);border-radius:12px;font-family:system-ui">
        <div style="text-align:center">
          <div style="font-size:32px;font-weight:700;color:#0284c7">CBS Accounting</div>
          <div style="margin-top:12px;color:#6b7280;font-size:14px">Starting up...</div>
          <div style="margin-top:20px;width:200px;height:4px;background:#e5e7eb;border-radius:4px;overflow:hidden;margin-left:auto;margin-right:auto">
            <div style="width:60%;height:100%;background:#0ea5e9;animation:load 1.5s ease-in-out infinite;border-radius:4px"></div>
          </div>
        </div>
      </body>
      <style>@keyframes load{0%{transform:translateX(-100%)}100%{transform:translateX(200%)}}</style>
    </html>
  `);

  try {
    await startServer();
    createWindow();
    splash.destroy();
  } catch (error) {
    splash.destroy();
    dialog.showErrorBox('CBS Accounting', `Failed to start: ${error.message}`);
    app.quit();
  }
});

app.on('window-all-closed', () => {
  if (serverProcess) {
    serverProcess.kill();
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  if (serverProcess) {
    serverProcess.kill();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
