const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('eAPI', {
    openFile: () => ipcRenderer.invoke('dialog:fileOpen')
});