window.onload = () => {
    // buttons
    document.getElementById("joinButton").onclick = function tryJoin() {
        
        var elem = document.documentElement;

        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) { /* Safari */
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { /* IE11 */
            elem.msRequestFullscreen();
        }
        
        socket.emit("join", null);
        
    }

    document.getElementById("startButton").onclick = function tryJoin() {
        socket.emit("gameStart", null);
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

function displayLosers() {
    const playerList = document.querySelector(".playerListLose");
    playerList.innerHTML = "";

    console.log(losers);

    for (let i = 0; i < losers.length; i++) {
        let newPlayer = document.createElement("div");
        newPlayer.classList.add("playerItem");
        newPlayer.textContent = (i + 1) + ". " + losers[losers.length - 1 - i];
        playerList.appendChild(newPlayer);
      }
}