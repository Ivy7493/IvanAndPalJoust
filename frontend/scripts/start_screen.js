import { gameIsRunning, startGame } from "./api_layer.js";
import {
  getUrlArgument,
  navigateTo,
  PLAYING_PAGE,
  WAITING_FOR_FINISH,
} from "./navigation.js";

window.start = async function start() {
  // This player is starting the game.

  await startGame();
  goToPlayingPage();
};

window.onload = async function () {
  const playerId = getUrlArgument("playerId");
  const isRunning = await gameIsRunning(playerId);

  if (isRunning) {
    // Redirect the player to wait for the game to finish.
    navigateTo(WAITING_FOR_FINISH);
  }

  // Else keep polling for game to start.
  const oneSecond = 1000;
  setInterval(navigateIfGameHasStarted, oneSecond);
};

/**
 * Called every second to navigate to Game page if game has started.
 */
async function navigateIfGameHasStarted() {
  const playerId = getUrlArgument("playerId");
  const isRunning = await gameIsRunning(playerId);
  if (isRunning) {
    goToPlayingPage();
  }
}

function goToPlayingPage() {
  navigateTo(PLAYING_PAGE, {
    playerId: getUrlArgument("playerId"),
  });
}
