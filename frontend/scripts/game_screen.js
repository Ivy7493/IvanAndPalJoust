import {
  addPlayerToQueue,
  removePlayerFromQueue,
  getGameState,
  addPlayerToLost,
  Auth,
  getSongName,
  InitGameListener,
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

let weDidShowWin = false;

window.onload = async function () {
  const oneSecond = 400;
  await CheckForReload();
  const playerId = getUrlArgument("playerId");
  InitGameListener(playerId);

  console.log("Player id is " + playerId);
  let canLobby = await Auth(playerId);
  console.log("Do we have permission?: ", canLobby);
  if (!canLobby) {
    navigateTo(WAITING_FOR_FINISH, {
      playerId: playerId,
    });
  }
  await RetrieveSong();
  setInterval(onTick, oneSecond);
};

window.onGyroscopeEvent = handleGyrosscopeEvent;
window.onAccelerometerEvent = handleAccelerometerEvent;

async function RetrieveSong() {
  let song = await getSongName();
  let base_url = window.location.origin;
  console.log("LinkToFile, ", song);
  window.parent.playPreloadedSong(song);

  // audioPlayer = new Audio(base_url + song);
  // audioPlayer.playbackRate = 2;
  // audioPlayer.loop = true;
  // audioPlayer.play();
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
  const isAuthenticated = await Auth(playerId);
  if (!isAuthenticated) {
    await logoutPlayer();
  }

  const gameState = await getGameState(playerId);
  window.parent.setPlayerRate(gameState.threshold);
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
    if (!weDidShowWin) {
      window.confirm("Yay! You have won!");
      weDidShowWin = true;
    }

    await logoutPlayer();
  }
}

/**
 * Computes the state of this player from the given game state.
 *
 * TODO: Logic to be implemented.
 */
function computePlayerState(gameState) {
  sensitivity = 0.1 / gameState.threshold;
  const winnerIsUs = gameState.winner === getUrlArgument("playerId");

  if (gameOver == true) {
    return PLAYER_STATE.LOST;
  } else if (gameState.isDone || winnerIsUs) {
    return PLAYER_STATE.WON;
  } else {
    return PLAYER_STATE.STILL_PLAYING;
  }
}

// ========== SENSOR DATA + UI ==========

import Color from "https://colorjs.io/dist/color.js";

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

function handleGyrosscopeEvent(event) {
  if (!gameOver && Date.now() - pageLoadTime > 2000) {
    // Vertical up has a beta of 90
    // upIcon.style.transform.rotate
    // setPercentage(Math.abs(90 - event.beta));
    // root.style.setProperty("--upIconRotation", 0*(event.beta-90) + "deg");

    let q = Quaternion.fromEuler(
      event.alpha * toRad,
      event.beta * toRad,
      event.gamma * toRad,
      "ZXY"
    );
    let qFinal = q.inverse();

    upIcon.style.transform =
      "scaleX(-1) matrix3d(" +
      qFinal.conjugate().toMatrix4() +
      ") rotateX(90deg) scaleX(-1)";
    // upIcon.style.transform = "rotate(" + qUp.dot(q) + "deg)";

    let v = q.toVector();
    let gyroScore = Math.abs(vDot(v, [0.7, 0.7, 0]));

    if (gyroScore < 0.75) {
      //Lose game
      gameOver = true;
      debug.textContent = "GAME OVER GYRO\n" + debug.textContent;
    }

    debug.innerHTML =
      v[0].toFixed(1) + ", " + v[1].toFixed(1) + ", " + v[2].toFixed(1); // + "<br />" + gyroScore.toFixed(3);
    // debug.innerHTML = event.alpha.toFixed(1) + "<br />" + event.beta.toFixed(1) + "<br />" + event.gamma.toFixed(1);
  }
}

function handleAccelerometerEvent(event) {
  if (!gameOver && Date.now() - pageLoadTime > 2000) {
    let mag = norm(
      event.acceleration.x,
      event.acceleration.y,
      event.acceleration.z
    );
    let sig = 100.0 * Math.abs(kfMotion.filter(mag)) * sensitivity;

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

function vDot(v1, v2) {
  return v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2];
}

screen.orientation //TODO: DOUBLE CHECK THIS <<--
  .lock()
  .then(function () {
    screen.lockOrientation("default");
  })
  .catch(function (e) {});

function getRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

// screen.orientation.lock();
// screen.lockOrientation("default");

// setPercentage(50.0);
// setInterval(addPercentage, 30);
