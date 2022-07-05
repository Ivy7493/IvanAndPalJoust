// In this page we constantly polling the Game service
// for the state of the game until the game is finished.

import { gameIsRunning } from "./api_layer.js";
import { navigateTo, JOIN_PAGE } from "./navigation.js";

window.onload = async function () {
  const oneSecond = 1000;
  setInterval(navigateIfGameIsFinished, oneSecond);
};

/**
 * Called every second to navigate to Join page if game has finished.
 */
async function navigateIfGameIsFinished() {
  const isRunning = await gameIsRunning();
  if (!isRunning) {
    navigateTo(JOIN_PAGE);
  }
}
