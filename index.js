const { app, BrowserWindow ,ipcMain} = require('electron');
const path = require('path');
const ytdl = require("youtube-dl-exec")
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}
const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 420,
    height: 540,
    resizable:false,
    webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
    }
  });
  mainWindow.removeMenu();
  mainWindow.loadFile(path.join(__dirname, 'index.html'));
  // mainWindow.webContents.openDevTools();
  ipcMain.on(
    'getVid'
    ,(s,url)=>{
          let stream = ytdl(
            url,
            {
              dumpSingleJson: true,
              noWarnings: true,
              noCallHome: true,
              noCheckCertificate: true,
              preferFreeFormats: true,
              youtubeSkipDashManifest: true,
              referer: 'https://example.com'
            }
          ).then(
            data=>{
              if(data.title){
                const {title,requested_formats,duration,thumbnails} = data
                  ,resp = {title,requested_formats,duration,thumbnails}
                  s.reply(
                    'getVid'
                    ,resp
                  )
                  console.log(data)
              }
            }
          )
    }
  )
};
app.on('ready', createWindow);
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
