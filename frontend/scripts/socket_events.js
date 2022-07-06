import { setPage } from "./setPage.js";

// navigatge to start page
socket.on("players", (p) => {
    players = p;
    if (!gameInProgress)
        setPage("start");
});

socket.on("name", (n) => {
    playerName = n;
});

// navigate to waiting page
socket.on("gameInProgress", () => {
    gameInProgress = true; // disable button
});

// navigate to game page
socket.on("start", () => {
    gameInProgress = true;
    setPage("game");
});

// getting the threshold value
socket.on("threshhold", (thresh) => {
    threshhold = thresh;
});