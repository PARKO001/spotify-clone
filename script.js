console.log("hello world!");

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

async function main() {
  let songs = await getSongs();
  console.log(songs);

  let songUl = document.querySelector(".songList").getElementsByTagName("ul")[0];
  for (const song of songs) {
    songUl.innerHTML = songUl.innerHTML + `<li>
                <div class="frst">
                  <img class="invert" src="./svg/song-logo.svg" alt="song svg">
                  <div class="info">
                  <div class="name">${song.replaceAll("%20" , " ").replace(".mp3", "")}</div>
                  <div class="Artist">Artist</div>
                </div>
                </div>
                <div class="playNow scnd">
                  <img class="invert" src="./svg/playSong.svg" alt="playSong svg">
                </div>
                </li>`;
  }

  var audio = new Audio(songs[1]);
  audio.play();

  audio.addEventListener("loadeddata", () => {
    let duration = audio.duration;
    console.log(duration / 60 );
  });
}

main();
