let lastReceivedGameState = undefined;

export function InitGameListener(playerId) {
  const gameStateSocket = io();

  gameStateSocket.emit("playerId", playerId);

  gameStateSocket.on("state", (stateStr) => {
    lastReceivedGameState = JSON.parse(stateStr);
    gameStateSocket.emit("playerId", playerId);
  });

  gameStateSocket.on("disconnect", () => {
    lastReceivedGameState = {
      isDone: true,
      threshold: 50,
      closeReason: "",
      winner: "",
      authList: []
    };
  });

  gameStateSocket.on("connect_error", () => {
    setTimeout(() => {
      gameStateSocket.connect();
    }, 1000);
  });
}

export async function makeUniquePlayer() {
  const response = await axios.get("/Identity/uniquePlayer");
  return response.data.data;
}

export async function getAllPlayers() {
  // const response = await axios.get("/Queue/players");
  // return response.data.data;

  return lastReceivedGameState.authList;
}

export async function addPlayerToQueue(playerId) {
  const response = await axios.post("/Queue/player", {
    name: playerId,
  });

  return response.data.data;
}

// returns an array
export async function addPlayerToLost(playerId) {
  const response = await axios.post("/Queue/Lost", {
    name: playerId,
  });

  return response.data.data;
}

// returns an array
export async function getAllLostPlayers() {
  const response = await axios.get("/Queue/LostPlayers");

  return response.data.data;
}

export async function Auth(playerID) {
  const response = await axios.get(`/Queue/Auth/${playerID}`);
  return response.data.data;
}

export async function removePlayerFromQueue(playerId) {
  const response = await axios.delete(`/Queue/player/${playerId}`);
  return response.data.data;
}

export async function startGame() {
  const response = await axios.put("/Game/start");
  return response.data.data;
}

export async function getSongName() {
  const response = await axios.get("/Game/song");
  return response.data.data;
}

export async function downloadSong(){
  const response = await axios.get("/Game/DownloadSong");
  return response.data.data;
}

/**
 * Game state is as follows:
 *
 * 1. Threshold for delta
 * 2. isDone (false if game is running)
 * 3. doneReason
 */
export async function getGameState(playerId) {
  while (!Boolean(lastReceivedGameState)) {
    await new Promise((r) => setTimeout(r, 200));
  }

  return lastReceivedGameState;
}

export async function gameIsRunning(playerId) {
  const gameState = await getGameState(playerId);
  return !gameState.isDone;
}
