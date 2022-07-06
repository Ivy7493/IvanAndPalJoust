import { makeUniquePlayer, addPlayerToQueue } from "./api_layer.js";
import { navigateTo, START_PAGE } from "./navigation.js";

/**
 * Called when the join button is clicked.
 */
window.join = async function join() {
  const playerId = await makeUniquePlayer();
  await addPlayerToQueue(playerId);
  navigateTo(START_PAGE, { playerId: playerId });
};

let isJoinEnabled = false;
setInterval(() => {
  if (!isJoinEnabled && window.parent.isMusicReady) {
    isJoinEnabled = true;
    document.getElementById("joinButton").style.display = "block";
    console.log("Join enabled");
  }
}, 100);
