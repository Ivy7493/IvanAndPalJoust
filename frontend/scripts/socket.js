export class Socket {
  constructor() {
    this.lastReceivedGameState = undefined;
    this.players = [];
    this.scoreBoard = [];

    this.gameStateSocket = io();

    this.gameStateSocket.on("state", (stateStr) => {
      lastReceivedGameState = JSON.parse(stateStr);
      this.gameStateSocket.emit("playerId", playerId);
    });
    
    this.gameStateSocket.on("disconnect", () => {
      lastReceivedGameState = {
        isDone: true,
        threshold: 50,
        closeReason: "",
        winner: "",
      };
    });
    
    this.gameStateSocket.on("connect_error", () => {
      setTimeout(() => {
        this.gameStateSocket.connect();
      }, 1000);
    });
    
    this.gameStateSocket.on("gameEnd", (sBoard) => { // recieves an array
      this.scoreBoard = sBoard;
    });
    
    this.gameStateSocket.on("playerList", (p) => { // recieves an array
      this.players = p;
      console.log(this.players);
    });
  }

  // functions to send data
  setPlayerId(playerId) {
    console.log(playerId);
    this.gameStateSocket.emit("playerId", playerId);
  }
  
  setPlayerLost(playerId) {
    this.gameStateSocket.emit("lost", playerId);
  }
}