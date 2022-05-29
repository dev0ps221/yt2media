const socket = new TeeSioCliSocket()
const viewtabs = document.querySelectorAll('nav ul li')


function actualViewTab(cb){
    viewtabs.forEach(
        tab=>{
            if(tab.classList.contains('actual')) cb(tab)
        }
    )
}

function switchActualView(actualtab){
    actualViewTab(
        tab=>{
            tab.classList.remove('actual')
            actualtab.classList.add('actual')
        }
    )
}

function listenSwitchActualView(){
    viewtabs.forEach(
        tab=>{
            tab.removeEventListener(
                'click',e=>{
                    switchActualView(e.target)
                }
            )
            tab.addEventListener(
                'click',e=>{
                    switchActualView(e.target)
                }
            )
        }
    )
}

function doAction(){

    actualViewTab(
        tab=>{
            const action = tab.innerText.toLowerCase() == 'search' || tab.innerText.toLowerCase() == 'chercher' ? 'searchVid' : 'getVid'
            
            const query = document.querySelector('#query').value
            if(query){
                socket.post(
                    action,query,({e,r})=>{
                        if(e)alert(e)
                        else{
                            refreshContentView(r)
                        }
                    }
                )
            }
        }
    )

}

function bytesToSize(bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Byte';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
 }

function renderVideoThumbnail(thumb){
    return `
        <span class='illu'>
            <img class='illupic' src='${thumb.url}'>
        </span>
    `
}

function renderDownloadLinks(formats){
    let rendered = ``
    formats.forEach(
        (format,idx)=>{
            // if(idx+1==formats.length){
                rendered = `${rendered}
                <li class='download'>
                    <a title='${format.title}' download target='_blank' href='${format.url}'> telecharger au format ${format.ext}  </a>
                </li>`
            // }
        }
    )
    return rendered
}

function renderVidContent(video){
    if(!video.requested_formats){
        video.requested_formats = video.formats.map(f=>{
            f.title = video.title
            console.log(video)
            console.log(f.mimeType.split(";")[0])
            f.url = video.url
            return f 
        })
    }
    return `
        <li class='videoresult'>
            <ul>
                <li class='title'>
                    ${video.title}
                </li>
                ${  
                    video.thumbnails && video.thumbnails.length ?
                        `<li class='illus'>
                            ${renderVideoThumbnail(video.thumbnails[0])}
                        </li>`
                    :   ''
                }
                <li class='downloads'>
                    <ul> 
                        ${renderDownloadLinks(video.requested_formats)}
                    </ul>
                </li>
            </ul>
        </li>
    `
}

function refreshContentView(videos){
    const contentview = document.querySelector('#view ul')
    if(videos){
        if(typeof videos == 'Array'){
            videos.forEach(
                video=>{
                    contentview.innerHTML=`${contentview.innerHTML}${renderVidContent(video)}`
                }
            )
        }else{
            video = videos
            contentview.innerHTML=`${contentview.innerHTML}${renderVidContent(video)}`            
        }
    }
}

function listenDoAction(){

    const querybutton = document.querySelector('#doquery')
    doquery.removeEventListener(
        'click',doAction
    )
    doquery.addEventListener(
        'click',doAction
    )
    

}
listenDoAction()
listenSwitchActualView()