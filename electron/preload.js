const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getDataPath: () => ipcRenderer.invoke('get-data-path'),
  getUploadsPath: () => ipcRenderer.invoke('get-uploads-path'),
  openFileDialog: (options) => ipcRenderer.invoke('open-file-dialog', options),
  openFolderDialog: () => ipcRenderer.invoke('open-folder-dialog'),
  platform: process.platform,
  isElectron: true,
});
