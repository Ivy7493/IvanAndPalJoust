export async function makeUniquePlayer() {
  const response = await axios.get("/Identity/uniquePlayer");
  return response.data.data;
}

export async function getAllPlayers() {
  const response = await axios.get("/Queue/players");
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
export async function getGameState() {
  const response = await axios.get("/Game/state");
  return response.data.data;
}

export async function gameIsRunning() {
  const gameState = await getGameState();
  return !gameState.isDone;
}
