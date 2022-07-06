// navigatge to start page
socket.on("players", (p) => {
    players = p;
    setPage("start");
});

socket.on("name", (n) => {
    playerName = n;
});

// navigate to waiting page
socket.on("gameInProgress", () => {
    gameInProgress = true; // disable button
});