const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const fs =  require("fs")
const ytdl = require("youtube-dl")
rl.question(
    "gimme a link:\n",
    async (message)=>{
        stream = await ytdl(message)
        rl.question(
            "Which name for the file?\n",
            (name)=>{

                var pipe = fs.createWriteStream(name+".mp4")
                stream.on('info', function(info) {

                    console.log("please wait...")
                    console.log('Download started')
                    console.log('filename: ' + info._filename)
                    console.log('size: ' + info.size)
                    stream.pipe(pipe)
                    // rl.close()
                })
                stream.on(
                    'end',data=>{
                        
                    }
                )
            }
        )

    }
)
rl.on(
    'close',
    ()=>{
        console.log('bye')
        process.exit()  
    }
)