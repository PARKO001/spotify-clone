console.log("hello world!");


let currentSong = new Audio();
let songs;
let currFolder;
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}



async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`http://127.0.0.1:3000/${folder}/`);
    let response = await a.text();
    // console.log(response)

    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    // console.log(as)
    songs = [];
    for (let i = 0; i < as.length; i++) {
        const element = as[i];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1]);
        }
    }
    let songUl = document.querySelector(".songList").getElementsByTagName("ul")[0];
    songUl.innerHTML = "";
    for (const song of songs) {
        songUl.innerHTML = songUl.innerHTML + `<li>
                <div class="frst">
                  <img class="invert" src="./svg/song-logo.svg" alt="song svg">
                  <div class="info">
                  <div class="name">${song.replaceAll("%20", " ")}</div>
                  <div class="Artist"><span>Artist</span></div>
                </div>
                </div>
                <div class="playNow scnd">
                  <img class="invert" src="./svg/playSong.svg" alt="playSong svg">
                </div>
                </li>`;
    }

    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })
}
const playMusic = (track, pause = false) => {
    currentSong.src = `/${currFolder}/` + track
    if (!pause) {
        currentSong.play()
        document.querySelector(".playSong").firstElementChild.src = "/svg/pauseSong.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track).replace(".mp3", "")
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}
async function displayAlbums(){
    let a = await fetch(`http://127.0.0.1:3000/songs/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors  = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardContainer");
    Array.from(anchors).forEach(async e=>{
        if(e.href.includes("/songs")){
            let folder = (e.href.split("/").slice(-2)[0])
            let a = await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`);
            let response = await a.json();
            // console.log(response)
            cardContainer.innnerHTML = cardContainer.innerHTML + `<div data-folder="cs" class="card border">
                <div class="play">
                  <img src="svg/play.svg" alt="play svg">
                </div>
                <img
                  class="raidus-circle"
                  src="/songs/${folder}/cover.jpg"
                  alt="cover image"
                />
                <h3>${response.title}</h3>
                <p>${response.description}</p>
              </div>`

        }
    })
    // console.log(div)
}

async function main() {

    await getSongs("songs/ncs");
    playMusic(songs[0], true)

    //display all the albums on the page
    displayAlbums();
    
    document.querySelector(".playSong").addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            document.querySelector(".playSong").firstElementChild.src = "/svg/pauseSong.svg"
        }
        else {
            currentSong.pause()
            document.querySelector(".playSong").firstElementChild.src = "/svg/playSong.svg"
        }
    })

    // listen for time update event
    currentSong.addEventListener("timeupdate", () => {
        console.log(currentSong.currentTime, currentSong.duration)
        document.querySelector(".songtime").innerHTML = `${formatTime(currentSong.currentTime)}/${formatTime(currentSong.duration)}`
        document.querySelector(".circle").style.left = `${(currentSong.currentTime / currentSong.duration) * 100}%`
    })

    // add an eventlistner on seekbar
    document.querySelector(".seekBar").addEventListener("click", (e) => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        console.log((e.offsetX / e.target.getBoundingClientRect().width) * 100)
        document.querySelector(".circle").style.left = `${percent}%`
        currentSong.currentTime = (percent * currentSong.duration) / 100
    })

    // add an eventlistner on hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = 0;
        // document.querySelector(".right").style.width = `${75}vw`
        // document.querySelector(".right").style.
    })

    //add an eventlistner on close
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-110%";
    })

    // add event listner on previous
    document.querySelector(".previousSong").addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if (index > 0) playMusic(songs[index - 1])
    })
    // add event listner on next
    document.querySelector(".nextSong").addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if (index < songs.length - 1) playMusic(songs[index + 1])
    })

    // add eventlistner on for volume 
    document.querySelectorAll(".volumesvg, .volumerange").forEach(element => {
        element.addEventListener("mouseenter", () => {
            document.querySelector(".volumerange").style.visibility = "visible";
        })
    })
    document.querySelectorAll(".volumesvg, .volumerange").forEach(element => {
        element.addEventListener("mouseleave", () => {
            document.querySelector(".volumerange").style.visibility = "hidden";
        })
    })
    let volumestate;
    document.querySelector(".volumesvg").addEventListener("click",()=>{
        if(currentSong.volume != 0){
            volumestate = currentSong.volume;
            document.querySelector(".songvolume").firstElementChild.src = "/svg/mute.svg";
            currentSong.volume = 0;
        }
        else{
            document.querySelector(".songvolume").firstElementChild.src = "/svg/volume.svg";
            currentSong.volume = volumestate;
        }
    })

    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
        currentSong.volume = parseInt(e.target.value)/100;
    })

    //load the playlist whenever card is clicked
    Array.from(document.getElementsByClassName("card")).forEach((e)=>{
        e.addEventListener("click" ,async (item)=>{
            console.log(item.currentTarget.dataset.folder)
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
        })
    })

}

main();
