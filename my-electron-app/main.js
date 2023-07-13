const path = require('path');
const {
    app,
    BrowserWindow,
    ipcMain,
    Menu
} = require('electron');
const axios = require('axios');


const createWindow = () => {
    const win = new BrowserWindow({
        width: 1080,
        height: 720,
        minWidth: 900,
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, './preload.js')
        }
    })

    win.loadFile('index.html');
}

app.whenReady().then(() => {

    ipcMain.handle('axios:get', async (event, searchData) => {
        console.log(searchData);
        const searchQuery = JSON.parse(searchData);
        console.log(searchQuery.domain);
        console.log(searchQuery.user_id);
        console.log(searchQuery.token);
        const url = `https://${searchQuery.domain}/api/v1/conversations?as_user_id=${searchQuery.user_id}`
        console.log(url);
        const conversations = await axios.get(url, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${searchQuery.token}`
            }
        });

        const data = conversations.data;

        console.log(data)
        return data;
    })
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

