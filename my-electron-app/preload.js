const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('eAPI', {
    onUpdateCounter: (callback) => ipcRenderer.on('update-counter', callback)
});