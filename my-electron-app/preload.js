const { contextBridge, ipcRenderer } = require('electron');
// const axios = require('axios');

// contextBridge.exposeInMainWorld('eAPI', {
//     onUpdateCounter: (callback) => ipcRenderer.on('update-counter', callback),
//     helloTest: (channel, data) => ipcMain.send(channel, data),

// });

contextBridge.exposeInMainWorld('axios', {
    getConvos: async (data) => {
        const result = await ipcRenderer.invoke('axios:getConvos', data);
        if (!result) {
            return false;
        }

        console.log('in preload total result ', result.length);

        return result;
    },
    deleteConvos: async (data) => {
        console.log('inside deleteConvos');

        return await ipcRenderer.invoke('axios:deleteConvos', data);
        // const result = await ipcRenderer.invoke('axios:deleteConvos', data, url);
    },
    checkCommChannel: async (data) => {
        console.log('inside preload checkCommChannel');
        return await ipcRenderer.invoke('axios:checkCommChannel', data);
    },
    checkCommDomain: async (data) => {
        console.log('Inside preload axios:checkCommDomain');
        return await ipcRenderer.invoke('axios:checkCommDomain', data);
    },
    createAssignments: async (data) => {
        console.log('inside preload createAssignments');

        return await ipcRenderer.invoke('axios:createAssignments', data);

    },
    deleteAssignments: async (data) => {
        console.log('inside preload deleteAssignments');
        return await ipcRenderer.invoke('axios:deleteAssignments', data);
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

        try {
            const response = await ipcRenderer.invoke('axios:getNoSubmissionAssignments', data);
            return response;
        } catch (error) {
            throw error;
        }

    },
    deleteNoSubmissionAssignments: async (data) => {
        console.log('preload > deleteNoSubmissionAssignments');

        return await ipcRenderer.invoke('axios:deleteNoSubmissionAssignments', data);
    },
    getUnpublishedAssignments: async (data) => {
        console.log('preload > getUnpublishedAssignments');

        return await ipcRenderer.invoke('axios:getUnpublishedAssignments', data);
    },
    getNonModuleAssignments: async (data) => {
        console.log('preload > deleteNonModuleAssignments');

        return await ipcRenderer.invoke('axios:getNonModuleAssignments', data);
    },
    getAssignmentsToMove: async (data) => {
        console.log('preload > getAssignmentsToMove');

        return await ipcRenderer.invoke('axios:getAssignmentsToMove', data);
    },
    moveAssignmentsToSingleGroup: async (data) => {
        console.log('preload > moveAssignmentsToSingleGroup');

        return await ipcRenderer.invoke('axios:moveAssignmentsToSingleGroup', data);
    },
    createAssignmentGroups: async (data) => {
        console.log('preload.js > createAssignmentGroups');

        return await ipcRenderer.invoke('axios:createAssignmentGroups', data);
    },
    deleteTheThings: async (data) => {
        console.log('preload.js > deleteTheThings');

        return await ipcRenderer.invoke('axios:deleteTheThings', data);
    },
    getPageViews: async (data) => {
        console.log('preload.js > getPageViews');

        return await ipcRenderer.invoke('axios:getPageViews', data);
    },
    resetCourses: async (data) => {
        console.log('preload.js > resetCourses');

        return await ipcRenderer.invoke('axios:resetCourses', data);
    },
    resetCommChannel: async (data) => {
        console.log('preload.js > rsetCommChannel');

        return await ipcRenderer.invoke('axios:resetCommChannel', data);
    },
    checkUnconfirmedEmails: async (data) => {
        console.log('preload.js > checkUnconfirmedEmails');

        return await ipcRenderer.invoke('axios:checkUnconfirmedEmails', data);
    },
    confirmEmails: async (data) => {
        console.log('preload.js > confirmEmails');

        return await ipcRenderer.invoke('axios:confirmEmails', data);
    },
    resetEmails: async (data) => {
        console.log('preload.js > resetEmails');

        return await ipcRenderer.invoke('axios:resetEmails', data);
    },
    createSupportCourse: async (data) => {
        console.log('preload.js > createSupportCourse');

        return await ipcRenderer.invoke('axios:createSupportCourse', data);
    }
});

contextBridge.exposeInMainWorld('csv', {
    sendToCSV: async (data) => {
        console.log('inside csv exporter');

        //console.log(data);

        await ipcRenderer.invoke('csv:sendToCSV', data);
    },
    sendToText: async () => {
        console.log('inside preload sendToText');

        ipcRenderer.send('csv:sendToText');
    }
});

contextBridge.exposeInMainWorld('dataUpdate', {
    onUpdate: async (callback) => ipcRenderer.on('email-count', (_event, value) => callback(value))
})

contextBridge.exposeInMainWorld('fileUpload', {
    confirmEmails: async (data) => {
        return await ipcRenderer.invoke('fileUpload:confirmEmails', data);
    },
    resetCourse: async () => {
        return await ipcRenderer.invoke('fileUpload:resetCourses');
    },
    resetEmails: async (data) => {
        return await ipcRenderer.invoke('fileUpload:resetEmails', data);
    }
})

contextBridge.exposeInMainWorld('progressAPI', {
    onUpdateProgress: (callback) => ipcRenderer.on('update-progress', (_event, value) => callback(value))
});

contextBridge.exposeInMainWorld('testAPI', {
    testing: () => {
        console.log('preload > testAPI:testing');
        ipcRenderer.send('testAPI:testing');
    }
});

contextBridge.exposeInMainWorld('menus', {
    rightclick: () => {
        ipcRenderer.send('right-click');
    },
    onMenuCommand: (callback) => {
        ipcRenderer.on('context-menu-command', (_event, data) => callback(data));
    },
    writeText: (data) => {
        ipcRenderer.send('write-text', (data));
    }
});

contextBridge.exposeInMainWorld('shell', {
    openExternal: (data) => {
        ipcRenderer.send('shell:openExternal', data);
    }
});