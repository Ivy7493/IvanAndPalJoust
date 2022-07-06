const express = require("express");
const http = require("http");
const { createSocket } = require("dgram");
const bodyParser = require("body-parser");
const mainRouter = require("./backend/routes/mainRoutes.js");
const { Server } = require("socket.io");
let nameLib = require("./frontend/scripts/nameGen");

process.on("uncaughtException", function (e) {
    console.log(e)
});

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("frontend"));
app.use("/", mainRouter);

let server = http.createServer(app);

server.listen(port, () => {
    console.log(`listening on http://localhost:${port}`);
});

// socket code
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

const io = new Server(server);
io.on('connection', (socket) => {
    console.log('a user connected');

    connections[socket.id] = {
        socket: socket,
        ready: false,
        playing: false,
    }; // adding to list
    numConnections++;

    socket.on('disconnect', async () => {
        console.log('user disconnected');
        if (connections[socket.id].ready)
            numPlayersReady--;

        let newPlayers = [];
        for (let p of players)
            if (p != connections[socket.id].name)
                newPlayers.push(p);

        // is client is in game and leaves add them as loser
        if (connections[socket.id].playing) {
            numPlaying--;
            losers.push(connections[socket.id].name);
            console.log(connections[socket.id].name);
            io.to(STATE.lost).emit("losers", losers);

            if (numPlaying == 1) {
                for (let c of Object.keys(connections))
                    if (!losers.includes(connections[c].name)) {
                        console.log(connections[c].name);
                        losers.push(connections[c].name);
                        await connections[c].socket.join(STATE.lost);
                        io.to(STATE.lost).emit("losers", losers);
                        break;
                    }
    
                reset();
                io.emit("finished", null);
            }
        }

        players = newPlayers;

        io.to(STATE.playing).emit("players", players);

        delete connections[socket.id];
        numConnections--;

        if (numConnections == 0)
            reset();
    });

    // asking for socket name
    socket.on("join", async () => {
        if (gameInProgress) {
            await socket.join(STATE.waiting);
            io.to(STATE.waiting).emit("gameInProgress");
        } else {
            numPlayersReady++; // temp
            let name = nameLib.GenerateName();
            connections[socket.id]["name"] = name; // adding name to json object
            players.push(name);
            socket.emit("name", name);
            await socket.join(STATE.playing);
            io.to(STATE.playing).emit("players", players);
        }
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
    socket.on("playerLost", async () => {
        numPlaying--;
        losers.push(connections[socket.id].name);
        await socket.join(STATE.lost);
        io.to(STATE.lost).emit("losers", losers); // sending the latest data of all the losers

        if (numPlaying == 1) { // there is a winner
            for (let c of Object.keys(connections))
                if (!losers.includes(connections[c].name)) {
                    losers.push(connections[c].name);
                    await connections[c].socket.join(STATE.lost);
                    io.to(STATE.lost).emit("losers", losers);
                    break;
                }

            reset();
            io.emit("finished", null);
        }
    });

    socket.on("gameStart", () => {
        for (let c of Object.keys(connections))
            connections[c].playing = true;

        gameInProgress = true;
        io.to(STATE.playing).emit("start", null) // for when the game starts
        numPlaying = numPlayersReady;
    });
});

function reset() {
    // connections = {}; // list of connection ids
    for (let c of Object.keys(connections)) {
        connections[c].socket.leave(STATE.playing);
        connections[c].socket.leave(STATE.lost);
        connections[c].socket.leave(STATE.waiting);
        connections[c].ready = false;
        connections[c].playing = false;
    }

    players = [] // name of the players
    losers = [];
    numPlayersReady = 0;
    numPlaying = 0;
    gameInProgress = false;
}

// send the threshold value
setInterval(() => {
    console.log("polled");
    io.to(STATE.playing).emit("threshhold", 0);
}, 1000)