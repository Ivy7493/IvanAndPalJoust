import { makeUniquePlayer,addPlayerToQueue } from "./api_layer.js";
import { navigateTo, START_PAGE } from "./navigation.js";
// import { setPlayerId } from "./socket.js";

/**
 * Called when the join button is clicked.
 */
window.join = async function join() {
  const playerId = await makeUniquePlayer();
  // setPlayerId(playerId);
  // await addPlayerToQueue(playerId);
  console.log(parent.gameStateSocket);
  parent.gameStateSocket.setPlayerId(playerId);
  navigateTo(START_PAGE, { playerId: playerId });
};
