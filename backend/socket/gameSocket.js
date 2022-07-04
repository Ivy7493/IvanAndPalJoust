const { Server } = require("socket.io");

class GameSocket {
    // instantiatest the socket, requires an http server
    constructor(server) {
        this.io = new Server(server);

        // setting events
        this.io.on('connection', (socket) => {
            console.log('a user connected');
          });
    }

    // sends a threshhold, data type is float
    sendThreshhold(threshhold) {
        this.io.emit("threshhold", {threshhold: threshhold});
    }
}

module.exports = GameSocket;