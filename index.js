const { app, BrowserWindow ,ipcMain} = require('electron');
const path = require('path');
const ytee = require('ytee')
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
  mainWindow.webContents.openDevTools();
  mainWindow.webContents.session.on(
    'will-download'
    ,(e, item, webContents) => {
      mainWindow.currentDownloadItem = item
      const ttal = item.getTotalBytes()
      const recv = item.getReceivedBytes()
      const name = item.getFilename()
      const done = item.isDone()
      const ispa = item.isPaused()
      const canr = item.canResume()  
      s.reply(
        'download-progression',{
          ttal,recv,name,done,ispa,canr
        }
      )
    }
  )
  ipcMain.on(
    'download',
    (s,{url})=>{
      mainWindow.webContents.downloadURL(
        url
      )
    }
  )
  ipcMain.on(
    'getVid'
    ,(s,url)=>{
      const download  = new ytee.Download(url)
      download.whenReady(
        ()=>{
          const data = download.data
          if(data.title){
            const {title,requested_formats,duration,thumbnails} = data
              ,resp = {title,requested_formats,duration,thumbnails}
              s.reply(
                'getVid'
                ,resp
              )
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
