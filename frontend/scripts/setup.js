import {
  createTrack,
  enableAudio,
  getActiveTrackPath,
  getAudioBuffer,
  getAudioTime,
  setActiveTrack,
  setActiveTrackTrate,
  stopActiveTrack,
} from "./audio_setup.js";
import { MovingAverageQueue } from "./data_structures.js";
import { IsCurrentPageGamePage } from "./setPage.js";
import { hashStringToColor, invertColor, hsvToString } from "./stringToRGB.js";

let joinButton = document.getElementById("joinButton");

const audioBuffers = new Map();
const lobbyMusic = "elevatorMusic.mp3";

export async function preloadAllAudio() {
  const audioFilenames = ["elevatorMusic.mp3", "Umbrella.mp3"];

  for (const song of audioFilenames) {
    const url = `${window.location.protocol}//${window.location.host}/audio/${song}`;
    const audioBuffer = await getAudioBuffer(url);
    audioBuffers.set(song, audioBuffer);
  }

  joinButton.style.display = "block";
  document.getElementById("loading").style.display = "none";
}

export async function playPreloadedSong(songPath, playInMillisFromNow = 0) {
  const lastSlashIndex = songPath.lastIndexOf("/");
  if (lastSlashIndex != -1) {
    songPath = songPath.substring(lastSlashIndex + 1);
  }

  for (const songFile of audioBuffers.keys()) {
    if (songFile === songPath && getActiveTrackPath() != songFile) {
      stopActiveTrack();

      const songBuffer = audioBuffers.get(songFile);
      const track = await createTrack(songBuffer);

      const when = getAudioTime() + playInMillisFromNow / 1000;
      track.start();
      setActiveTrack(track, songFile);
      console.log("Song started ", songPath);
    }
  }
}

export function setPlayerRate(rate) {
  setActiveTrackTrate(rate);
}

export function StopMusic() {
  stopActiveTrack();
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
      didSyncMusic = true;
      const avgDelta = serverClientTimeDeltas.getAverage();
      // const estServerTime = Date.now() + avgDelta;

      const futureServerTimeAsLocal = serverTimeToResetSong + avgDelta;
      const diffToAwait = futureServerTimeAsLocal - Date.now();
      playPreloadedSong("Umbrella.mp3", diffToAwait);

      // if (estServerTime >= serverTimeToResetSong) {
      //   RestartPlayingSong(estServerTime);
      //   console.log("music reset at est server time", estServerTime);
      // }
    }
  }
}

window.onload = () => {
  joinButton = document.getElementById("joinButton");
  preloadAllAudio();

  // buttons
  joinButton.onclick = async () => {
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

    await enableAudio();
    playPreloadedSong("elevatorMusic.mp3");

    socket.emit("join", null);
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

    //Create elements
    let newPlayer = document.createElement("div");
    newPlayer.classList.add("playerItem");

    //Player colored bubble
    let newPlayerBubble = document.createElement("span");
    newPlayerBubble.textContent = "⬤";
    newPlayerBubble.classList.add("playerBubble");
    newPlayerBubble.style.color = hsvToString(color);

    newPlayer.appendChild(newPlayerBubble);

    // newPlayer.style.backgroundColor = "#81d881"; //TODO: Integrate with player ready state

    //You
    if (playerName == p){
      newPlayer.style.border = "2px solid white";
      newPlayer.style.transform = "scale(1.05)";
    }
    newPlayer.appendChild(document.createTextNode(p + (playerName == p ? " (You)" : "")));

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

    let iColor = hsvToString(invColor);
    newPlayer.style.color = iColor;
    if (playerName == losers[losers.length - 1 - i])
      newPlayer.style.border = "2px solid " + iColor;
    newPlayer.style.backgroundColor = hsvToString(color);

    playerList.appendChild(newPlayer);
  }
}
