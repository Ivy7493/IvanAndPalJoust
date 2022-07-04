// This page is shown when the player has lost (or is out)
// Here we vibrate the device for 1 second and wait for 4
// more seconds to navigate to the waiting_for_finish_screen.

import { navigateTo, WAITING_FOR_FINISH } from "./navigation.js";

window.onload = async function () {
  vibrateDevice();

  const oneSecond = 1000;
  setInterval(navigateToWaitingForFinishScreen, oneSecond * 5);
};

/**
 * Called after 5 seconds after page has loaded to navigate to loading screen.
 */
async function navigateToWaitingForFinishScreen() {
  navigateTo(WAITING_FOR_FINISH);
}

function vibrateDevice() {
  window.navigator.vibrate(300);
}
