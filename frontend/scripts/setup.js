window.onload = () => {
    document.getElementById("joinButton").onclick = function tryJoin() {
        socket.emit("join", null);
    }
}

// functions needed to be called in multple areas
// add code to indentify players
function displayPlayers() {
    const playerList = document.querySelector(".playerList");
    playerList.innerHTML = "";

    for (let p of players) {
        let newPlayer = document.createElement("div");
        newPlayer.classList.add("playerItem");
        newPlayer.textContent = p;
        playerList.appendChild(newPlayer);
    }
}