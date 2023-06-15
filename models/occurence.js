class Occurence{
  links = {
    mp3:[],
    mp4:[]
  }
  titre = None
  duree = None
  getLinks(){
    return this.links
  }
  getTitre(){
    return this.titre
  }
  getDuree(){
    return this.duree
  }
  setTitre(titre){
    this.titre = titre
  }
  setDuree(duree){
    this.duree = duree
  }
  setNewLink(format,link,bitrate){
    this.links[format].push(
      {
        link,bitrate
      }
    )
  }
}
class Download{
  occurences = []
  static getVideo(link){
    const ytee = require('ytdl-core');    
    const res = ytee(link) 
    console.log(JSON.stringify(res))
    res.pipe('sound.mp3')
  }
}

Download.getVideo("https://www.youtube.com/embed/WFVE26Q7Kpg")
