import { gameIsRunning, startGame,getAllPlayers, addPlayerToQueue,Auth} from "./api_layer.js";
import {
  getUrlArgument,
  navigateTo,
  PLAYING_PAGE,
  WAITING_FOR_FINISH,
} from "./navigation.js";

const playerList = document.querySelector(".playerList");


async function UpdatePlayers(){
  let list = await getAllPlayers()
  console.log("what we got from request: ",list)
  addPlayers(list)
}


window.start = async function start() {
  // This player is starting the game.

  await startGame();
  goToPlayingPage();
};

window.onload = async function () {
  const playerId = getUrlArgument("playerId");
  const isRunning = await gameIsRunning(playerId);      
  let canLobby = await Auth(playerId)
  if (isRunning || !canLobby) {
    // Redirect the player to wait for the game to finish.
    navigateTo(WAITING_FOR_FINISH);
  }
  
  // Else keep polling for game to start.
  const oneSecond = 1000;
  setInterval(navigateIfGameHasStarted, oneSecond);
  setInterval(UpdatePlayers, oneSecond);
};

/**
 * Called every second to navigate to Game page if game has started.
 */
async function navigateIfGameHasStarted() {
  const playerId = getUrlArgument("playerId");
  const isRunning = await gameIsRunning(playerId);
  console.log("What we got from the server: ", isRunning)
  if (isRunning) {
    goToPlayingPage();
  }
}

function goToPlayingPage() {
  navigateTo(PLAYING_PAGE, {
    playerId: getUrlArgument("playerId"),
  });
}




function addPlayers(list) {
    ClearPlayersList()
    console.log("List numbers: ", list.length)
    for(let x of list){
      addPlayer(x)
    }
}

window.onbeforeunload = CheckForReload;

function ClearPlayersList(){
  playerList.innerHTML = "";
}

function addPlayer(name) {
    let newPlayer = document.createElement("div");
    newPlayer.classList.add("playerItem");
    newPlayer.textContent = name;
    playerList.appendChild(newPlayer);
}

function CheckForReload(){
  let data=window.performance.getEntriesByType("navigation")[0].type;
  console.log(data);
    if (data === "reload") {
      logoutPlayer()
    } 
}

window.Add

async function logoutPlayer() {
  const playerId = getUrlArgument("playerId");
  await removePlayerFromQueue(playerId);
}
