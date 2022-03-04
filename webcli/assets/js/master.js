
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
            const action = tab.innerText.toLowerCase() == 'search' ? 'searchVid' : 'getVid'
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

function refreshContentView(videos){
    alert('lets refresh our content view')
    console.log(videos)
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