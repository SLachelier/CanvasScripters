const { contextBridge, ipcRenderer } = require('electron');
// const axios = require('axios');

contextBridge.exposeInMainWorld('eAPI', {
    onUpdateCounter: (callback) => ipcRenderer.on('update-counter', callback),
    helloTest: (channel, data) => ipcMain.send(channel, data),

});

contextBridge.exposeInMainWorld('axios', {
    getConvos: async (data) => {
        const result = await ipcRenderer.invoke('axios:getConvos', data);
        console.log('in preload total result ', result.length);

        return result;
    },
    deleteConvos: async (data) => {
        console.log('inside deleteConvos');

        return await ipcRenderer.invoke('axios:deleteConvos', data);
        // const result = await ipcRenderer.invoke('axios:deleteConvos', data, url);
    },
    getEmptyAssignmentGroups: async (data) => {
        console.log('inside preload getEmptyAssignmentGroups');
        return await ipcRenderer.invoke('axios:getEmptyAssignmentGroups', data);
    },
    deleteEmptyAssignmentGroups: async (data) => {
        console.log('Inside axios:deleteEmptyAssignmentGroups');

        return await ipcRenderer.invoke('axios:deleteEmptyAssignmentGroups', data);
    },
    getNoSubmissionAssignments: async (data) => {
        console.log('preload > getNoSubmissionAssignments');

        return await ipcRenderer.invoke('axios:getNoSubmissionAssignments', data);
    },
    deleteNoSubmissionAssignments: async (data) => {
        console.log('preload > deleteNoSubmissionAssignments');

        return await ipcRenderer.invoke('axios:deleteNoSubmissionAssignments', data);
    },
    getPageViews: async (data) => {
        console.log('preload.js > getPageViews');

        return await ipcRenderer.invoke('axios:getPageViews', data);
    }
});

contextBridge.exposeInMainWorld('csv', {
    sendToCSV: async (data) => {
        console.log('inside csv exporter');

        //console.log(data);

        await ipcRenderer.invoke('csv:sendToCSV', data);
    }
});