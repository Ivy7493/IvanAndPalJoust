import {
  addPlayerToQueue,
  removePlayerFromQueue,
  getGameState,
  addPlayerToLost,
  Auth,
  getSongName
} from "./api_layer.js";
import {
  getUrlArgument,
  navigateTo,
  WAITING_FOR_FINISH,
  PLAYER_LOST,
} from "./navigation.js";

const PLAYER_STATE = {
  STILL_PLAYING: 1,
  LOST: 2,
  WON: 3,
};

let audioPlayer = new Audio()

window.onload = async function () {
  const oneSecond = 400;
  await CheckForReload();
  const playerId = getUrlArgument("playerId");
  console.log("Player id is " + playerId);
  let canLobby = await Auth(playerId);
  console.log("DO we have permission?: ", canLobby);
  if (!canLobby) {
    navigateTo(WAITING_FOR_FINISH, {
      playerId: playerId,
    });
  }
  await RetrieveSong()
  setInterval(onTick, oneSecond);
};


async function RetrieveSong (){
  let song = await getSongName();
  let base_url = window.location.origin;
  console.log("LinkToFIle, ", base_url + song)
  audioPlayer = new Audio(base_url + song)
  audioPlayer.playbackRate = 2
  audioPlayer.loop = true;
  audioPlayer.preservesPitch = false;
  audioPlayer.play();
}

async function CheckForReload() {
  let data = window.performance.getEntriesByType("navigation")[0].type;
  console.log(data);
  if (data === "reload") {
    await logoutPlayer();
  }
}

async function logoutPlayer() {
  const playerId = getUrlArgument("playerId");
  await removePlayerFromQueue(playerId);
  navigateTo(WAITING_FOR_FINISH, {
    playerId: playerId,
  });
}

async function onTick() {
  // Check if the player is still authenticated.
  //Ivan ------ Uncomment this later for BATA to fix
  const playerId = getUrlArgument("playerId"); //<------------------------- HERE BOYS HERE
  //const isAuthenticated = await Auth(playerId);
  //if (!isAuthenticated) {
   // alert("Yikes we got here")
   // await logoutPlayer();
 // }

  const gameState = await getGameState(playerId);
  console.log("Over here!: ",gameState)
  console.log("Furthermore, ", gameState.Threshold)
  audioPlayer.playbackRate = gameState.Threshold
  const playerState = computePlayerState(gameState);
  await processPlayerState(playerState);
}

/**
 * Processeses the state of this player to show the correct UI.
 */
async function processPlayerState(playerState) {
  if (playerState === PLAYER_STATE.LOST) {
    const playerId = getUrlArgument("playerId");
    addPlayerToLost(playerId);  
    await logoutPlayer();
    navigateTo(PLAYER_LOST);
  } else if (playerState === PLAYER_STATE.WON) {
    const playerId = getUrlArgument("playerId");
    addPlayerToLost(playerId);  
    await logoutPlayer();
    window.confirm("Yay! You have won!");

    // Wait for finish screen should navigate automaticaly to join screen.
    // This is a way of ensuring there are no more players remaining.
    navigateTo(WAITING_FOR_FINISH, {
      playerId: playerId,
    });
  }
}

/**
 * Computes the state of this player from the given game state.
 *
 * TODO: Logic to be implemented.
 */
function computePlayerState(gameState) {
  sensitivity = 1 / gameState.threshold;
  if (gameOver == true) {
    return PLAYER_STATE.LOST;
  } else {
    return PLAYER_STATE.STILL_PLAYING;
  }
}

// ========== SENSOR DATA + UI ==========

import Color from "https://colorjs.io/dist/color.js";

// const tracks = ["cotton eyed joe", "care", "skrillex", "darude sandstorm"];

// var spotifyApi = new SpotifyWebApi({
//   clientId: "dc7a851b63e941099d977fc57edb3aec",
//   clientSecret: "04d0a090ad874972b7ae824534cd2c38"
//   // redirectUri: process.env.CALLBACK_URL,
// });

// // var spotifyApi = new SpotifyWebApi();

// // Build formData object.
// let formData = new FormData();
// formData.append('grant_type', "authorization_code");
// formData.append('client_id', "dc7a851b63e941099d977fc57edb3aec");
// formData.append('client_secret', "04d0a090ad874972b7ae824534cd2c38");

// fetch("https://accounts.spotify.com/api/token", {
//     method: "post",
//     headers: {
//       'Accept': 'application/json',
//       'Content-Type': 'application/x-www-form-urlencoded'
//     },
//     body: formData
//   })
//   .then( (response) => { 
//     console.log("OVER HERE");
//     console.log(response);
//   });

// spotifyApi.getToken().then(function(response) {
//   spotifyApi.setAccessToken("");
// });

// //Song request here

// console.log("SEARCH TRACKS:\n");
// spotifyApi.searchTracks(getRandom(tracks), {limit: 1}).then( x => {
//   console.log(x);
// });

const shakeBar = document.querySelector(".shakeBar");
const root = document.querySelector(":root");
const debug = document.querySelector("#debug");
const upIcon = document.querySelector(".bigIcon");
const toRad = Math.PI / 180.0;
const qUp = new Quaternion(0, 0, 1, 0);

const barCol1 = new Color("lightgreen");
const barCol2 = new Color("tomato");
const barGradient = barCol1.range(barCol2, {
  space: "lch",
  outputSpace: "srgb",
  hue: "increasing",
});

let percentage = 0.0;
let kfMotion = new KalmanFilter({ R: 0.01, Q: 20, A: 0.5 });
let kfRotate = new KalmanFilter();
let sensitivity = 1;

let gameOver = false;

if (window.DeviceOrientationEvent) {
addEventListener("deviceorientation", function (event) {
  // Vertical up has a beta of 90
  // upIcon.style.transform.rotate
  // setPercentage(Math.abs(90 - event.beta));
  // root.style.setProperty("--upIconRotation", 0*(event.beta-90) + "deg");

  let q = Quaternion.fromEuler(event.alpha * toRad, event.beta * toRad, event.gamma * toRad, 'ZXY');
  let qFinal = q.inverse();

  upIcon.style.transform = "scaleX(-1) matrix3d(" + qFinal.conjugate().toMatrix4() + ") rotateX(90deg) scaleX(-1)";
  // upIcon.style.transform = "rotate(" + qUp.dot(q) + "deg)";

  let v = qFinal.toVector();
  debug.innerHTML = v[0].toFixed(1) + ", " + v[1].toFixed(1) + ", " + v[2].toFixed(1);
  // debug.innerHTML = event.alpha.toFixed(1) + "<br />" + event.beta.toFixed(1) + "<br />" + event.gamma.toFixed(1);
  }, true);
}

if (window.DeviceMotionEvent) {
  addEventListener(
    "devicemotion",
    function () {
      if (!gameOver && Date.now()-pageLoadTime > 2000) {
        let mag = norm( event.acceleration.x, event.acceleration.y, event.acceleration.z);
        let sig = 100.0 * Math.abs(kfMotion.filter(mag));

        debug.textContent = sig.toFixed(4);
        setPercentage(clamp(sig, 0.0, 100.0));

        if (sig > 100.0) {
          //Lose game
          gameOver = true;
          setPercentage(100);
          debug.textContent = "GAME OVER " + debug.textContent;
        }
        // if(sig < min) { min = sig; debug.textContent = min; }
      }
    },
    true
  );
} else {
  addEventListener(
    "MozOrientation",
    function (event) {
      // debug.textContent = orientation.x;
    },
    true
  );
}


function setPercentage(perc) {
  percentage = perc;
  updateShakeBar();
}

function addPercentage() {
  percentage += 0.5;
  percentage %= 100;
  updateShakeBar();
}

function updateShakeBar() {
  shakeBar.style.height = percentage + "%";

  shakeBar.style.opacity = remap(percentage, 0.0, 100.0, 20.0, 30.0) + "%";
  // shakeBar.style.backgroundColor = barGradient(percentage/100.0).toString();
  root.style.setProperty(
    "--shakeAmount",
    (percentage * percentage) / 200.0 + "px"
  );
  document.body.style.backgroundColor = barGradient(
    percentage / 100.0
  ).toString();
}

function remap(x, fromMin, fromMax, toMin, toMax) {
  return ((x - fromMin) / fromMax) * toMax + toMin;
}

function sigmoid(z) {
  return 1.0 / (1 + Math.exp(-z / 2));
}

function clamp(x, min, max) {
  return Math.min(max, Math.max(min, x));
}

function threshold(x, t) {
  return Math.max(x, t);
}

function norm(x, y, z) {
  return x * x + y * y + z * z;
}

screen.orientation //TODO: DOUBLE CHECK THIS <<--
  .lock()
  .then(function () {
    screen.lockOrientation("default");
  })
  .catch(function (e) {});

function getRandom(list) {
  return list[Math.floor(Math.random()*list.length)];
}



// screen.orientation.lock();
// screen.lockOrientation("default");

// setPercentage(50.0);
// setInterval(addPercentage, 30);
