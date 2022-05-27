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
      let ttal = item.getTotalBytes()
      let recv = item.getReceivedBytes()
      let name = item.getFilename()
      let done = item.isDone()
      let ispa = item.isPaused()
      let canr = item.canResume()  
      console.log(item.getSavePath())
      item.on('updated', (event, state) => {
        ttal = item.getTotalBytes()
        recv = item.getReceivedBytes()
        name = item.getFilename()
        done = item.isDone()
        ispa = item.isPaused()
        canr = item.canResume()
        if (state === 'interrupted') {
          mainWindow.webContents.send(
            'download-interupted',{
              ttal,recv,name,done,ispa,canr
            }
          )
        } else if (state === 'progressing') {
          if (item.isPaused()) {
            mainWindow.webContents.send(
              'download-pause',{
                ttal,recv,name,done,ispa,canr
              }
            )
          } else {
            mainWindow.webContents.send(
              'download-progress',{
                ttal,recv,name,done,ispa,canr
              }
            )
          }
        }
      })
      item.on(
        'done',(e,state)=>{

          ttal = item.getTotalBytes()
          recv = item.getReceivedBytes()
          name = item.getFilename()
          done = item.isDone()
          ispa = item.isPaused()
          canr = item.canResume()
          if(state=='completed'){
            mainWindow.webContents.send(
              'download-complete',{
                ttal,recv,name,done,ispa,canr
              }
            )
          }
        }
      )
      mainWindow.webContents.send(
        'download-progress',{
          ttal,recv,name,done,ispa,canr
        }
      )
    }
  )



  ipcMain.on(
    'download',
    (s,{url,name})=>{
      mainWindow.currentDownloadFilename = name
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
