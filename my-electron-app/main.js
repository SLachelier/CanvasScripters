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

    const menu = Menu.buildFromTemplate([
        {
            label: app.name,
            submenu: [
                {
                    click: () => win.webContents.send('update-counter', 1),
                    label: 'Increment'
                },
                {
                    click: () => win.webContents.send('update-counter', -1),
                    label: 'Decrement'
                }
            ]
        }
    ])
    Menu.setApplicationMenu(menu)

    win.loadFile('index.html');
    win.webContents.openDevTools();
}

app.whenReady().then(() => {
    ipcMain.on('counter-value', (event, value) => {
        console.log(value);
    })
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
})