export async function makeUniquePlayer() {
  const response = await axios.get("/Identity/uniquePlayer");
  return response.data.data;
}

export async function getAllPlayers() {
  const response = await axios.get("/Queue/players");
  return response.data.data;
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
export async function getAllLostPlayers(playerId) {
  const response = await axios.get("/Queue/LostPlayers");

  return response.data.data;
}

export async function Auth(playerID){
  const response = await axios.get(`/Queue/Auth/${playerID}`)
  return response.data.data;
}

export async function removePlayerFromQueue(playerId) {
  console.log("ayyyyooooio")
  const response = await axios.delete(`/Queue/player/${playerId}`);
  return response.data.data;
}

export async function startGame() {
  const response = await axios.put("/Game/start");
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
  const response = await axios.get(`/Game/state/${playerId}`);
  return response.data.data;
}

export async function gameIsRunning(playerId) {
  const gameState = await getGameState(playerId);
  console.log(playerId + ": GameState : " + gameState.isDone)
  return !gameState.isDone;
}
