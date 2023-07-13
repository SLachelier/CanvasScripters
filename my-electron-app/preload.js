const { contextBridge, ipcRenderer } = require('electron');
// const axios = require('axios');

contextBridge.exposeInMainWorld('eAPI', {
    onUpdateCounter: (callback) => ipcRenderer.on('update-counter', callback),
    helloTest: (channel, data) => ipcMain.send(channel, data),

});

contextBridge.exposeInMainWorld('axios', {
    get: async (data) => {
        console.log('Stringified: ', data);
        console.log('Parsed ', JSON.parse(data));
        const result = await ipcRenderer.invoke('axios:get', data)
        console.log(result);

        return result;
    }
});