const { TeeSio } = require("@tek-tech/teesio")
const http = require('http')
const express = require('express')
const app     = new express()
const server = http.createServer(app)
const ytee = require('ytee')
const searcher  = ytee.Searcher
const path = require('path')
const sockets = new TeeSio({server,sio:require('socket.io')})
const views = path.join(__dirname,'webcli','views')
const assets = path.join(__dirname,'webcli','assets')
const port = process.env.PORT || 8000


app.use(
    '/',express.static(path.join(assets))
)
app.use(
    '/bgs',express.static(path.join(assets,'bgs'))
)
app.use(
    '/css',express.static(path.join(assets,'css'))
)
app.use(
    '/js',express.static(path.join(assets,'js'))
)
app.use(
    '/ear',express.static(path.join(process.cwd(),'node_modules','@tek-tech/ears/ears.js'))
)
app.use(
    '/sio',express.static(path.join(process.cwd(),'node_modules','socket.io/client-dist/socket.io.min.js'))
)
app.use(
    '/socket.io.min.js.map',express.static(path.join(process.cwd(),'node_modules','socket.io/client-dist/socket.io.min.js.map'))
)
app.get(
    '/siosocket',(req,res)=>{
        res.send(
            (require('fs').readFileSync(sockets.getSocketClassPath()).toString())
        )
    }
)
app.get(
    '/',(req,res)=>{
        res.sendFile(
            path.join(views,'index.html')
        )


    }
)
app.get(
    '/convert',(req,res)=>{
        res.sendFile(
            path.join(views,'convert.html')
        )


    }
)
server.listen(
    port,(err)=>{



        if(err){
            console.warn('erreurs lors de la tentative de lancement du service sur le port ',port)
            console.error(err)

            return
        }else{
            
            sockets.whenReady(
                ()=>{
                    
                    sockets.listen()
                    
                    sockets.registerSocketListener(
                        [
                            'getVid',(url,socket)=>{

                                const download  = new ytee.Download(url)
                                download.whenReady(
                                    ()=>{
                                        const data = download.data
                                        if(data.title){
                                            const   {title,requested_formats,formats,duration,thumbnails} = data
                                            ,resp = {title,requested_formats,formats,duration,thumbnails}
                                            console.log(data,' is the result')
                                            socket.post(
                                                'getVidRes',({e:null,r:resp})
                                            )
                                        }
                                    }
                                )
                            }
                        ]
                    )
                    sockets.registerSocketListener(
                        [

                            'searchVid',(name,socket)=>{
                                const res = []
                                searcher.search(name,results=>{
                                    results.forEach(
                                        (result,idx)=>{

                                            result.whenReady(
                                                ()=>{
                                                const data = result._downloaddata
                                                if(data.title){
                                                    const 
                                                    {title,requested_formats,duration,thumbnails} = data
                                                    ,resp = {title,requested_formats,duration,thumbnails}
                                                    res.push(
                                                        resp
                                                    )
                                                    if(idx+1==results.length){
                                                        socket.post(
                                                            'searchVidRes',({e:null,r:res})
                                                        )
                                                    }
                                                }
                                                }
                                            )

                                        }       
                                    )

                                })

                            }

                        ]
                    )
                    console.log(
                        'sockets ready'
                    )


                }
            )


        
        
        
        
        
        
            console.log('Service actif sur le port ',port)
        }
    }
)
