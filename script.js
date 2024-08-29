console.log("hello world!");


let currentSong = new Audio();

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}



async function getSongs() {
    let a = await fetch("http://127.0.0.1:3000/songs/");
    let response = await a.text();
    // console.log(response)

    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    // console.log(as)
    let songs = [];
    for (let i = 0; i < as.length; i++) {
        const element = as[i];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1]);
        }
    }
    return songs;
}
const playMusic = (track, pause=false) => {
    currentSong.src = "/songs/" + track
    if(!pause){
        currentSong.play()
        document.querySelector(".playSong").firstElementChild.src = "/svg/pauseSong.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track).replace(".mp3","")
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}

async function main() {

    let songs = await getSongs();

    playMusic(songs[0],true)

    let songUl = document.querySelector(".songList").getElementsByTagName("ul")[0];
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

    //   document.querySelector(".nextSong").addEventListener("click", ()=>{
    //     let currentLi = 
    //   })

    //   var audio = new Audio(songs[1]);
    //   audio.play();


    //   audio.addEventListener("loadeddata", () => {
    //     let duration = audio.duration;
    //     console.log(duration / 60 );
    //   });

    // listen for time update event
    currentSong.addEventListener("timeupdate", () => {
        console.log(currentSong.currentTime, currentSong.duration) 
        document.querySelector(".songtime").innerHTML = `${formatTime(currentSong.currentTime)}/${formatTime(currentSong.duration)}`
        document.querySelector(".circle").style.left = `${(currentSong.currentTime/currentSong.duration)*100}%`
    })

    // add an eventlistner on seekbar
    document.querySelector(".seekBar").addEventListener("click", (e) => {
        let percent = (e.offsetX/e.target.getBoundingClientRect().width)*100
        console.log((e.offsetX/e.target.getBoundingClientRect().width)*100)
        document.querySelector(".circle").style.left = `${percent}%`
        currentSong.currentTime = (percent*currentSong.duration)/100
    })

    // add an eventlistner on hamburger
    document.querySelector(".hamburger").addEventListener("click" , ()=>{
        document.querySelector(".left").style.left = 0;
        // document.querySelector(".right").style.width = `${75}vw`
        // document.querySelector(".right").style.
    })

    //add an eventlistner on close
    document.querySelector(".close").addEventListener("click" , ()=>{
        document.querySelector(".left").style.left = "-100%";
    })
}

main();
