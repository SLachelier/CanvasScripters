const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('eAPI', {
    setTitle: (title) => ipcRenderer.send('set-title', title)
});