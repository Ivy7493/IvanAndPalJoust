import {
  gameIsRunning,
  startGame,
  getAllPlayers,
  Auth,
  removePlayerFromQueue,
  getSongName,
  InitGameListener
} from "./api_layer.js";
import {
  getUrlArgument,
  navigateTo,
  PLAYING_PAGE,
  WAITING_FOR_FINISH,
} from "./navigation.js";

const playerList = document.querySelector(".playerList");


async function UpdatePlayers(){
  let list = await getAllPlayers();
  console.log("what we got from request: ",list);
  addPlayers(list);
}

window.start = async function start() {
  // This player is starting the game.

  await startGame();


  goToPlayingPage();
};

window.onload = async function () {
  await CheckForReload()
  const playerId = getUrlArgument("playerId");
  InitGameListener(playerId);

  const isRunning = await gameIsRunning(playerId);      
  let canLobby = await Auth(playerId)
  console.log("Lobby stuff "+ canLobby)
  if (isRunning || !canLobby) {
    // Redirect the player to wait for the game to finish.
    navigateTo(WAITING_FOR_FINISH, {
      playerId: playerId
    });
  }
  
  // Else keep polling for game to start.
  const delay = 250;
  setInterval(navigateIfGameHasStarted, delay);
  setInterval(UpdatePlayers, delay);
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
    clearPlayersList()
    console.log("List numbers: ", list.length)
    for(let x of list){
      addPlayer(x)
    }
}

window.onunload = CheckForReload;

function clearPlayersList(){
  playerList.innerHTML = "";
}

function addPlayer(name) {
    let newPlayer = document.createElement("div");
    newPlayer.classList.add("playerItem");
    newPlayer.textContent = name;
    playerList.appendChild(newPlayer);
}

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
