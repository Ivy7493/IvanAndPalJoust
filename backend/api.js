// const { Server } = require("socket.io");

const STATE = {
    playing: "playing",
    lost: "lost",
    waiting: "waiting",
  };

let connections = {}; // list of connection ids
let numConnections = 0;
let players = [] // name of the players
let losers = [];
let numPlayersReady = 0;
let numPlaying = 0;
let gameInProgress = false;

function createSocket(io) {
    io.on('connection', (socket) => {
        console.log('a user connected');

        connections[socket.id] = {
            socket: socket,
            ready: false
        }; // adding to list
        numConnections++;

        socket.on('disconnect', () => {
            console.log('user disconnected');
            players.splice(players.findIndex(connections[socket.id].name), 1); // remove from names
            delete connections[socket.id];
            numConnections--;
        });

        
        // asking for socket name
        socket.on("join", () => {
            console.log("got here");
            // if (gameInProgress) {
            //     socket.join(STATE.waiting);
            //     socket.to(STATE.waiting).emit("bad");
            // } else {
            //     let name = "Awesome Name";
            //     connections[socket.id]["name"] = name; // adding name to json object
            //     players.add(name);
            //     console.log(name);
            //     socket.emit("yourName", name);
            //     socket.emit("name", name);
            //     socket.join(STATE.playing);
            //     socket.to("playing").emit("players", players);
            // }
        });

        // returns array
        socket.on("getPlayers", () => {
            socket.emit("players", players);
        });

        // makes player ready
        socket.on("playerReady", (ready) => {
            if (ready) {
                if (!connections[socket.id].ready) {
                    connections[socket.id].ready = true;
                    numPlayersReady++;
                }
    
                if (numPlayersReady == numConnections) {
                    io.emit("allReady", null);
                }
            } else {
                if (connections[socket.id].ready)
                    numPlayersReady--;
                connections[socket.id].ready = false;
            }
        });

        // for when a player lost
        socket.on("playerLost", () => {
            numPlaying--;
            losers.push(connections[socket.id].name);
            socket.join(STATE.lost);
            io.to(STATE.losers).emit("losers", losers); // sending the latest data of all the losers

            if (numPlaying == 0) {
                gameInProgress = false;
                io.to(STATE.losers).emit("finished", null);
            }
        });

        socket.on("gameStart", () => {
            gameInProgress = true;
            io.to(STATE.playing).emit("start", null) // for when the game starts
            numPlaying = numPlayersReady;
        });
    });
}