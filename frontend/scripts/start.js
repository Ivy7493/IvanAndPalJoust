import { displayPlayers, playPreloadedSong } from "./setup.js";

export async function initStart() {
    displayPlayers();
    const song = "elevatorMusic.mp3";
    await playPreloadedSong(song);
}