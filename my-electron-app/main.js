const path = require('path');
const {
    app,
    BrowserWindow,
    ipcMain,
    Menu
} = require('electron');
//const axios = require('axios');
const convos = require('./conversations');
const csvExporter = require('./csvExporter');
const assignmentGroups = require('./assignment_groups');
const { send } = require('process');


const createWindow = () => {
    const win = new BrowserWindow({
        width: 1080,
        height: 720,
        minWidth: 900,
        webPreferences: {
            nodeIntegration: false,
            preload: path.join(__dirname, './preload.js')
        }
    })

    win.webContents.openDevTools();
    win.loadFile('index.html');
}

app.whenReady().then(() => {

    ipcMain.handle('axios:getConvos', async (event, searchData) => {
        console.log('Inside main:getConvos');
        console.log(searchData);

        //const searchQuery = JSON.parse(searchData);
        const domain = searchData.domain;
        const userID = searchData.user_id;
        const apiToken = searchData.token;
        // const inboxMessages = [];
        // const sentMessages = [];
        // const totalMessages = [];

        console.log('The domain ', domain);
        console.log('The userID ', userID);
        console.log('The apiToken ', apiToken);

        // getting messages in 'inbox'
        let url = `https://${domain}/api/v1/conversations?as_user_id=${userID}&per_page=100`;
        console.log(url);

        const inboxMessages = await convos.getConversations(userID, url, 'inbox', apiToken);
        console.log('Total inbox messages: ', inboxMessages.length)

        // getting messages in 'sent'
        const sentMessages = await convos.getConversations(userID, url, 'sent', apiToken);
        console.log('Total sent messages', sentMessages.length);

        const totalMessages = [...inboxMessages, ...sentMessages];
        console.log('Total messages ', totalMessages.length);

        return totalMessages;
    });

    ipcMain.handle('axios:deleteConvos', async (event, data) => {
        console.log('inside axios:deleteConvos');

        console.log(data.token);

        const result = await convos.bulkDeleteNew(data.messages, `https://${data.domain}/api/v1/conversations`, data.token);
        console.log('finished');

        return result;

    });

    ipcMain.handle('axios:getEmptyAssignmentGroups', async (event, data) => {
        console.log('Inside axios:getEmptyAssignmentGroups')

        const aGroups = await assignmentGroups.getEmptyAssignmentGroups(data.domain, data.course, data.token);

        return aGroups;
    });

    ipcMain.handle('axios:deleteEmptyAssignmentGroups', async (event, data) => {
        console.log('Inside axios:getEmptyAssignmentGroups')

        const result = await assignmentGroups.deleteEmptyAssignmentGroups(data.domain, data.course, data.token, data.groups);

        return result;
    });

    ipcMain.handle('csv:sendToCSV', async (event, data) => {
        console.log('inside cvs:sendtoCSV');
        //console.log(data);

        csvExporter.exportToCSV(data, 'exported_convos');
    });

    //ipcMain.handle('')
    createWindow();

    // for mac os creates new window when activated
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    })


})

// for windows and linux closes app when all windows are closed
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
})

