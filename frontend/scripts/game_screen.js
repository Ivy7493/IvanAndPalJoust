import {
  addPlayerToQueue,
  removePlayerFromQueue,
  getGameState,
  Auth
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

window.onload = async function () {
  const oneSecond = 1000;
  await CheckForReload()
  const playerId = getUrlArgument("playerId");
  let canLobby = await Auth(playerId)
  console.log("DO we have permission?: ",canLobby)
  if(!canLobby){
    navigateTo(WAITING_FOR_FINISH);
  }
  setInterval(onTick, oneSecond * 5);
};

window.onbeforeunload = logoutPlayer;

async function CheckForReload(){
  let data=window.performance.getEntriesByType("navigation")[0].type;
  console.log(data);
    if (data === "reload") {

      await logoutPlayer()
    } 
}


async function logoutPlayer() {
  const playerId = getUrlArgument("playerId");
  await removePlayerFromQueue(playerId);
}

async function onTick() {
  const playerId = getUrlArgument("playerId");
  const gameState = await getGameState(playerId);
  const playerState = computePlayerState(gameState);
  await processPlayerState(playerState);
}

/**
 * Processeses the state of this player to show the correct UI.
 */
async function processPlayerState(playerState) {
  if (playerState === PLAYER_STATE.LOST) {
    await logoutPlayer();
    navigateTo(PLAYER_LOST);
  } else if (playerState === PLAYER_STATE.WON) {
    await logoutPlayer();
    window.confirm("Yay! You have won!");

    // Wait for finish screen should navigate automaticaly to join screen.
    // This is a way of ensuring there are no more players remaining.
    navigateTo(WAITING_FOR_FINISH);
  }
}

/**
 * Computes the state of this player from the given game state.
 *
 * TODO: Logic to be implemented.
 */
function computePlayerState(gameState) {
  return PLAYER_STATE.STILL_PLAYING;
}



