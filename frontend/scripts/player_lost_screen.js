// This page is shown when the player has lost (or is out)
// Here we vibrate the device for 1 second and wait for 4
// more seconds to navigate to the waiting_for_finish_screen.
import { getAllLostPlayers, InitGameListener } from "./api_layer.js";
import { getUrlArgument, navigateTo, WAITING_FOR_FINISH } from "./navigation.js";

window.onload = function () {
  const playerId = getUrlArgument("playerId");
  InitGameListener(playerId);

  // setTimeout(navigateToWaitingForFinishScreen, 1000 * 10);
  setInterval(updateScoreBoard, 1000);
};

async function updateScoreBoard() {
  const playerList = document.querySelector(".playerList");
  console.log(playerList);
  playerList.innerHTML = "";

  let players = await getAllLostPlayers();
  
  console.log(players);

  for (let i = 0; i < players.length; i++) {
    let newPlayer = document.createElement("div");
    newPlayer.classList.add("playerItem");
    newPlayer.textContent = (i + 1) + ". " + players[players.length - 1 - i];
    playerList.appendChild(newPlayer);
  }
}

/**
 * Called after 5 seconds after page has loaded to navigate to waiting for finish screen.
 */
async function navigateToWaitingForFinishScreen() {
  const playerId = getUrlArgument("playerId");
  navigateTo(WAITING_FOR_FINISH, {
    playerId: playerId,
  });
}
