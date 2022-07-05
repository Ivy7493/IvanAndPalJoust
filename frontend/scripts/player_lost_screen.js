// This page is shown when the player has lost (or is out)
// Here we vibrate the device for 1 second and wait for 4
// more seconds to navigate to the waiting_for_finish_screen.
import { getAllLostPlayers, addPlayerToLost } from "./api_layer.js";
import { navigateTo, WAITING_FOR_FINISH } from "./navigation.js";

window.onload = async function () {
  const oneSecond = 2000;
  setInterval(navigateToWaitingForFinishScreen, oneSecond * 5);

  setInterval(UpdatePlayers, oneSecond)
};

async function UpdatePlayers(){
  let list = await getAllLostPlayers()
  console.log("what we got from request: ",list)
  addPlayers(list)
}

/**
 * Called after 5 seconds after page has loaded to navigate to loading screen.
 */
async function navigateToWaitingForFinishScreen() {
  navigateTo(WAITING_FOR_FINISH);
}

function vibrateDevice() {
  // window.navigator.vibrate(300);
}

const playerList = document.querySelector(".playerList");

function clearPlayersList(){
  playerList.innerHTML = "";
}

function addPlayer(name) {
    let newPlayer = document.createElement("div");
    newPlayer.classList.add("playerItem");
    newPlayer.textContent = name;
    playerList.appendChild(newPlayer);
}

function addPlayers(list) {
  clearPlayersList()
  console.log("List numbers: ", list.length)
  for(let x of list){
    addPlayer(x)
  }
}
