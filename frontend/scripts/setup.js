import { IsCurrentPageGamePage } from "./setPage.js";
import { hashStringToColor, invertColor, rgbToString } from "./stringToRGB.js";

let joinButton = document.getElementById("joinButton");

const audioPlayers = new Map();
const readySongs = new Map();

async function preloadAllAudio() {
  const audioFilenames = ["elevatorMusic.mp3", "Umbrella.mp3"];

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

  joinButton.style.display = "block";
  document.getElementById("loading").style.display = "none";
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

function setPlayerRate(rate) {
  for (const song of audioPlayers.keys()) {
    const player = audioPlayers.get(song);
    if (!player.paused && song != "elevatorMusic.mp3") {
      player.playbackRate = rate;
    } else if (!player.paused && song == "elevatorMusic.mp3") {
      player.playbackRate = 1;
    }
  }
}

function StopMusic() {
  for (const song of audioPlayers.keys()) {
    const player = audioPlayers.get(song);
    if (!player.paused) {
      player.pause();
    }
  }
}

function RestartPlayingSong() {
  for (const song of audioPlayers.keys()) {
    const player = audioPlayers.get(song);
    if (!player.paused) {
      player.currentTime = 0;
    }
  }
}

// The time in future that all devices should reset their music
let serverTimeToResetSong = 0;
let serverClientTimeDeltas = [];
const serverClientDeltasToMaintain = 20;
let didSyncMusic = false;

export function SetServerTimeToResetSong(value) {
  serverTimeToResetSong = value;
}

export function OnServerTimestamp(serverTimestamp) {
  const delta = Date.now() - serverTimestamp;
  serverClientTimeDeltas.push(delta);

  if (serverClientTimeDeltas.length > serverClientDeltasToMaintain) {
    serverClientTimeDeltas.shift();

    // Be ready to sync audio if we are on game screen
    if (IsCurrentPageGamePage() && !didSyncMusic) {
      const arr = serverClientTimeDeltas;
      const avgDelta = (() => arr.reduce((a, b) => a + b, 0) / arr.length)();

      const localisedServerTimeToResetSong = serverTimeToResetSong + avgDelta;

      // localisedServerTimeToResetSong is in future
      const diffToReset = localisedServerTimeToResetSong - Date.now();
      console.log("Syncing in", diffToReset);
      setTimeout(() => {
        RestartPlayingSong();
        didSyncMusic = true;
        console.log("Song reset at", Date.now());
      }, diffToReset);
    }
  }
}

window.onload = () => {
  joinButton = document.getElementById("joinButton");
  preloadAllAudio();

  // buttons
  joinButton.onclick = function tryJoin() {
    var elem = document.documentElement;

    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      /* Safari */
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      /* IE11 */
      elem.msRequestFullscreen();
    }

    socket.emit("join", null);
    playPreloadedSong("elevatorMusic.mp3");
  };

  document.getElementById("startButton").onclick = function tryJoin() {
    socket.emit("gameStart", null);
  };
};

// functions needed to be called in multple areas
// add code to indentify players
export function displayPlayers() {
  const playerList = document.querySelector(".playerList");
  playerList.innerHTML = "";

  for (let p of players) {
    // colors
    let color = hashStringToColor(p);
    let invColor = invertColor(color);

    let newPlayer = document.createElement("div");
    newPlayer.classList.add("playerItem");
    newPlayer.textContent = p;

    if (playerName == p) {
      let iColor = rgbToString(invColor);
      newPlayer.style.color = iColor;
      newPlayer.style.border = "2px solid " + iColor;
    }
    newPlayer.style.backgroundColor = rgbToString(color);

    playerList.appendChild(newPlayer);
  }
}

export function displayLosers() {
  const playerList = document.querySelector(".playerListLose");
  playerList.innerHTML = "";

  for (let i = 0; i < losers.length; i++) {
    // colors
    let color = hashStringToColor(losers[losers.length - 1 - i]);
    let invColor = invertColor(color);

    let newPlayer = document.createElement("div");
    newPlayer.classList.add("playerItem");
    newPlayer.textContent = i + 1 + ". " + losers[losers.length - 1 - i];

    if (playerName == losers[losers.length - 1 - i]) {
      let iColor = rgbToString(invColor);
      newPlayer.style.color = iColor;
      newPlayer.style.border = "2px solid " + iColor;
    }
    newPlayer.style.backgroundColor = rgbToString(color);

    playerList.appendChild(newPlayer);
  }
}
