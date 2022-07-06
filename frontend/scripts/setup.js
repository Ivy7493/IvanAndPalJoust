import { MovingAverageQueue } from "./data_structures.js";
import { IsCurrentPageGamePage } from "./setPage.js";
import { hashStringToColor, invertColor, rgbToString } from "./stringToRGB.js";

let joinButton = document.getElementById("joinButton");

const audioPlayers = new Map();
const readySongs = new Map();

const lobbyMusic = "elevatorMusic.mp3";

async function preloadAllAudio() {
  const audioFilenames = ["elevatorMusic.mp3", "Umbrella.mp3"];

  for (const song of audioFilenames) {
    const url = `${window.location.protocol}//${window.location.host}/audio/${song}`;
    const audioObject = new Audio(url);
    audioObject.load();

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

export async function playPreloadedSong(songPath) {
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

export function setPlayerRate(rate) {
  for (const song of audioPlayers.keys()) {
    const player = audioPlayers.get(song);
    if (!player.paused && song != lobbyMusic) {
      player.playbackRate = rate;
    } else if (!player.paused && song == lobbyMusic) {
      player.playbackRate = 1;
    }
  }
}

export function StopMusic() {
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
const serverClientTimeDeltas = new MovingAverageQueue(40);
const rttValues = new MovingAverageQueue(40);
let didSyncMusic = false;

export function OnRTT(rtt) {
  rttValues.addValue(rtt);
}

export function ResetMusicSync() {
  didSyncMusic = false;
}

export function SetServerTimeToResetSong(value) {
  serverTimeToResetSong = value;
}

export function OnServerTimestamp(serverTimestamp) {
  if (!rttValues.isFull()) return;

  const halfRtt = rttValues.getAverage() / 2;
  const delta = Date.now() - serverTimestamp - halfRtt;
  serverClientTimeDeltas.addValue(delta);

  if (serverClientTimeDeltas.isFull()) {
    // Be ready to sync audio if we are on game screen
    if (IsCurrentPageGamePage() && !didSyncMusic) {
      const avgDelta = serverClientTimeDeltas.getAverage();
      const estServerTime = Date.now() + avgDelta;

      if (estServerTime >= serverTimeToResetSong) {
        didSyncMusic = true;
        RestartPlayingSong();
        console.log("music reset at est server time", estServerTime);
      }
    }
  }
}

window.onload = () => {
  joinButton = document.getElementById("joinButton");
  preloadAllAudio();

  // buttons
  joinButton.onclick = () => {
    let elem = document.documentElement;

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

  let clickCount = 0; // number of clicks before showing alert
  document.getElementById("startButton").onclick = () => {
    let elem = document.documentElement;

    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      /* Safari */
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      /* IE11 */
      elem.msRequestFullscreen();
    }

    // need at least 2 players to play
    if (players.length > 1) socket.emit("gameStart", null);

    clickCount++;
    if (clickCount == 5) {
      clickCount = 0;
      alert("You require at least 2 players to player");
    }
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

    let iColor = rgbToString(invColor);
    newPlayer.style.color = iColor;
    if (playerName == p) newPlayer.style.border = "2px solid " + iColor;
    newPlayer.style.backgroundColor = rgbToString(color);

    playerList.appendChild(newPlayer);
  }
  newPlayer.style.backgroundColor = rgbToString(color);

  playerList.appendChild(newPlayer);
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

    let iColor = rgbToString(invColor);
    newPlayer.style.color = iColor;
    if (playerName == losers[losers.length - 1 - i])
      newPlayer.style.border = "2px solid " + iColor;
    newPlayer.style.backgroundColor = rgbToString(color);

    playerList.appendChild(newPlayer);
  }
}
