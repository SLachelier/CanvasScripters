const path = require('path');
const {
    app,
    BrowserWindow,
    ipcMain,
    Menu
} = require('electron');


const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, './preload.js')
        }
    })

    win.loadFile('index.html');
    win.webContents.openDevTools();
}

app.whenReady().then(() => {
    createWindow();

    // for max os creates new window when activated
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    })
})

// for windows and linux closes app when all windows are closed
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
})