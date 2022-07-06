import { setPage } from "./setPage.js";
import { OnRTT, OnServerTimestamp, ResetMusicSync, SetServerTimeToResetSong } from "./setup.js";
import {SetSensitivity} from './game.js'
import {setPlayerRate, StopMusic} from './setup.js'
import { MovingAverageQueue } from "./data_structures.js";

// navigatge to start page
socket.on("players", (p) => {
  players = p;
  if (!gameInProgress) {
    playing = true;
    setPage("start");
  }
});

socket.on("name", (n) => {
  playerName = n;
});

// navigate to waiting page
socket.on("gameInProgress", () => {
  gameInProgress = true; // disable button
  playing = false;
  gameProgess();
});

// navigate to game page
socket.on("start", () => {
  gameInProgress = true;
  setPage("game");
});

// getting the threshold value
socket.on("threshhold", (thresh) => {
    setPlayerRate(thresh)
    SetSensitivity(thresh)
    threshhold = thresh;
});

// gets sent to the losing players
socket.on("losers", (l) => {
    losers = l;
    console.log(l);
    setPage("lose");
});

// gets sent to the losing players
socket.on("finished", async () => {
    if (playing) {
        const sleep = ms => new Promise(r => setTimeout(r, ms));
        await sleep(5000); // waiting so everyone can see score
        
        StopMusic();
    }
    
    // resetting state
    players = []; // the players
    playerName = ""; // players name
    gameInProgress = false;
    playing = false;
    playerReady = false;
    readyPlayers = [];
    allReady = false;
    threshhold = 0;
    losers = [];

    gameFinished();
    setPage("join");
});

socket.on("readyPlayers", (p) => {
    readyPlayers = p;
});

socket.on("allReady", (r) => {
    allReady = r;
});

socket.on("serverTime", (timestamp) => {
    OnServerTimestamp(timestamp);
});
  
socket.on("timeToResetMusic", (timestamp) => {
    SetServerTimeToResetSong(timestamp);
    ResetMusicSync();
});

socket.on("rtt", (timestamp) => {
    const rtt = Date.now() - timestamp;
    OnRTT(rtt);
});

setInterval(() =>{
    socket.emit("rtt", Date.now());
}, 100);

function gameProgess() {
  let joinButton = document.getElementById("joinButton");
  joinButton.innerHTML = "Game in Progress please wait...";
  // joinButton.disabled = true;
  // joinButton.style.backgroundColor = 'brown'
}

function gameFinished() {
  let joinButton = document.getElementById("joinButton");
  joinButton.innerHTML = "Join game";
  // joinButton.style.backgroundColor = 'rgb(42, 165, 54)';
  // joinButton.disabled = false;
}
