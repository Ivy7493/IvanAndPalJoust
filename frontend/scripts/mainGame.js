import { makeUniquePlayer } from "./api_layer.js";

const audioPlayers = new Map();
const readySongs = new Map();

async function preloadAllAudio() {
  const audioFilenames = [
    "elevatorMusic.mp3",
    "lose.mp3",
    "cottonEyedJoe.m4a",
    "JMABGRZ-claps-clapping.mp3",
    "TeamSpirit.mp3",
    "Umbrella.mp3",
  ];

  for (const song of audioFilenames) {
    const url = `${window.location.protocol}//${window.location.host}/audio/${song}`;
    const audioObject = new Audio(url);
    audioObject.loop = true;
    audioPlayers.set(song, audioObject);
    readySongs.set(song, false);

    audioObject.oncanplaythrough = function (_) {
      console.log(song, " is ready");
      readySongs.set(song, true);
    };
  }

  // Wait for them to be ready to play
  let shouldWait = false;
  do {
    await new Promise((r) => setTimeout(r, 100)); // Use Promise to not block song fetching

    shouldWait = false;
    for (const song of readySongs.keys()) {
      const ready = readySongs.get(song);

      if (!ready) {
        shouldWait = true;
        break;
      } else {
        readySongs.set(song, true);
      }
    }
  } while (shouldWait);

  console.log("All songs ready");
}

async function playPreloadedSong(songPath) {
  const lastSlashIndex = songPath.lastIndexOf("/");
  if (lastSlashIndex != -1) {
    songPath = songPath.substring(lastSlashIndex + 1);
  }

  for (const songFile of audioPlayers.keys()) {
    const songPlayer = audioPlayers.get(songFile);

    if (songFile === songPath) {
      await songPlayer.play();
    } else {
      songPlayer.pause();
    }
  }
}

window.playPreloadedSong = playPreloadedSong;
window.onload = () => {
  preloadAllAudio();
};

var elem = document.getElementById("frame");

$(document).ready(function () {
  $("iframe").on("load", function () {
    $(this)
      .contents()
      .on("mousedown, mouseup, click", function () {
        playPreloadedSong("audio/Umbrella.mp3");

        if (elem.requestFullscreen) {
          elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) {
          elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) {
          elem.msRequestFullscreen();
        }
      });
  });
});
