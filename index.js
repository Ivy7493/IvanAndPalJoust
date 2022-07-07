const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const mainRouter = require("./backend/routes/mainRoutes.js");
const { Server } = require("socket.io");
let nameLib = require("./frontend/scripts/nameGen");

process.on("uncaughtException", function (e) {
  console.log(e);
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
let players = []; // name of the players
let losers = [];
let readyList = []; // list of players who are ready
let numPlayersReady = 0;
let numPlaying = 0;
let gameInProgress = false;

const io = new Server(server);
io.on("connection", (socket) => {
  console.log("a user connected");

  connections[socket.id] = {
    socket: socket,
    ready: false,
    playing: false,
  }; // adding to list
  numConnections++;

  socket.on("disconnect", async () => {
    console.log("user disconnected");

    let newPlayers = [];
    for (let p of players)
      if (p != connections[socket.id].name) newPlayers.push(p);

    players = newPlayers;

    // is client is in game and leaves add them as loser
    if (connections[socket.id].playing) {
      if (connections[socket.id].ready) {
        numPlayersReady--;
      }
      numPlaying--;
      losers.push(connections[socket.id].name);
      io.to(STATE.lost).emit("losers", losers);

      if (numPlaying == 1) {
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
    }

    io.to(STATE.playing).emit("players", players);

    delete connections[socket.id];
    numConnections--;

    if (numConnections == 0) reset();
  });

  // asking for socket name
  socket.on("join", async () => {
    if (gameInProgress) {
      await socket.join(STATE.waiting);
      io.to(STATE.waiting).emit("gameInProgress");
    } else {
      let name = nameLib.GenerateName();
      numPlaying++;
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
    if (connections[socket.id].name != undefined)
    if (ready) {
      if (!connections[socket.id].ready) {
        connections[socket.id].ready = true;
        numPlayersReady++;
        console.log("NPREADY " + numPlayersReady);
        readyList.push(connections[socket.id].name);
      }

      io.to(STATE.playing).emit("readyPlayers", readyList);

      if (numPlayersReady == numPlaying) {
        console.log(numPlayersReady + " PLAYERS READY");
        io.to(STATE.playing).emit("allReady", true);
      }
    } else {
      if (connections[socket.id].ready) numPlayersReady--;
      connections[socket.id].ready = false;
      // readyList.splice(readyList.findIndex(connections[socket.id].name), 1);

      let newPlayers = [];
      for (let p of readyList)
        if (p != connections[socket.id].name) newPlayers.push(p);

      readyList = newPlayers;

      io.to(STATE.playing).emit("readyPlayers", readyList);

      io.to(STATE.playing).emit("allReady", false);
    }
  });
  
  
  // for when a player lost
  socket.on("playerLost", async () => {
    if (gameInProgress) {
      numPlaying--;
      console.log("NUM PLAYERS PLAYING " + numPlaying);
      losers.push(connections[socket.id].name);
      
      await socket.join(STATE.lost);
      io.to(STATE.lost).emit("losers", losers); // sending the latest data of all the losers
      
      if (numPlaying == 1) {
        // there is a winner
        for (let c of Object.keys(connections)) {
          if (!losers.includes(connections[c].name) && connections[c].playing) {
            losers.push(connections[c].name);
            console.log(losers);
            await connections[c].socket.join(STATE.lost);
            io.to(STATE.lost).emit("losers", losers);
            break;
          }
        }
  
        reset();
        io.emit("finished", null);
      }
    }
  });

  socket.on("gameStart", () => {
    for (let c of Object.keys(connections)) if (connections[c].name != undefined) connections[c].playing = true;

    gameInProgress = true;
    io.to(STATE.playing).emit("start", null); // for when the game starts
    io.to(STATE.playing).emit("timeToResetMusic", Date.now() + 4000); // set time in future for clients to sync music
  });

  socket.on("rtt", (timestamp) => {
    socket.emit("rtt", timestamp);
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

  players = []; // name of the players
  losers = [];
  readyList = [];
  numPlayersReady = 0;
  numPlaying = 0;
  gameInProgress = false;
}

// send the threshold value
setInterval(() => {
  let max = 2;
  let min = 0.5;
  let x = Math.random() * (max - min) + min;
  x = Math.floor(x*2)/2.0;
  // console.log("POGGERS X: " + x);
  io.to(STATE.playing).emit("threshhold", x);
}, 4000);

// Send server timestamp
setInterval(() => {
  io.to(STATE.playing).emit("serverTime", Date.now());
}, 100);


// const express = require("express");
// const http = require("http");
// const bodyParser = require("body-parser");
// const mainRouter = require("./backend/routes/mainRoutes.js");
// const { Server } = require("socket.io");
// let nameLib = require("./frontend/scripts/nameGen");

// process.on("uncaughtException", function (e) {
//   console.log(e);
// });

// const app = express();
// const port = process.env.PORT || 3000;

// app.use(bodyParser.json({ limit: "100mb" }));
// app.use(bodyParser.urlencoded({ extended: true }));

// app.use(express.static("frontend"));
// app.use("/", mainRouter);

// let server = http.createServer(app);

// server.listen(port, () => {
//   console.log(`listening on http://localhost:${port}`);
// });

// // socket code
// const STATE = {
//   playing: "playing",
//   lost: "lost",
//   waiting: "waiting",
// };

// let connections = {}; // list of connection ids
// let numConnections = 0;
// let players = []; // name of the players
// let losers = [];
// let readyList = []; // list of players who are ready
// let numPlayersReady = 0;
// let numPlaying = 0;
// let gameInProgress = false;

// const io = new Server(server);
// io.on("connection", (socket) => {
//   console.log("a user connected");

//   connections[socket.id] = {
//     socket: socket,
//     ready: false,
//     playing: false,
//   }; // adding to list
//   numConnections++;

//   socket.on("disconnect", async () => {
//     console.log("user disconnected");
//     if (connections[socket.id].ready) numPlayersReady--;

//     // let newPlayers = [];
//     // for (let p of players)
//     //   if (p != connections[socket.id].name) newPlayers.push(p);

//     // players = newPlayers;

//     // is client is in game and leaves add them as loser
//     if (connections[socket.id].playing) {
//       if (connections[socket.id].ready) {
//         numPlayersReady--;
//       }
//       numPlaying--;
//       losers.push(connections[socket.id].name);
//       io.to(STATE.lost).emit("losers", losers);

//       if (numPlaying == 1) {
//         for (let c of Object.keys(connections))
//           if (!losers.includes(connections[c].name)) {
//             losers.push(connections[c].name);
//             await connections[c].socket.join(STATE.lost);
//             io.to(STATE.lost).emit("losers", losers);
//             break;
//           }

//         reset();
//         io.emit("finished", null);
//       }
//     }

//     io.to(STATE.playing).emit("players", players);

//     players = players.filter(pn => {
//       return pn != connections[socket.id].name;
//     });
//     delete connections[socket.id];
//     numConnections--;

//     if (numConnections == 0) reset();
//   });

//   // asking for socket name
//   socket.on("join", async () => {
//     if (gameInProgress) {
//       await socket.join(STATE.waiting);
//       io.to(STATE.waiting).emit("gameInProgress");
//     } else {
//       let name = nameLib.GenerateName();
//       numPlaying++;
//       connections[socket.id]["name"] = name; // adding name to json object
//       players.push(name);
//       socket.emit("name", name);
//       await socket.join(STATE.playing);
//       io.to(STATE.playing).emit("players", players);
//     }
//   });

//   // returns array
//   socket.on("getPlayers", () => {
//     socket.emit("players", players);
//   });

//   // makes player ready
//   socket.on("playerReady", (ready) => {
//     if (ready) {
//       if (!connections[socket.id].ready) {
//         // console.log("got here");
//         connections[socket.id].ready = true;
//         numPlayersReady++;
//         readyList.push(connections[socket.id].name);
//       }

//       io.to(STATE.playing).emit("readyPlayers", readyList);

//       if (numPlayersReady == numPlaying) {
//         console.log(numPlayersReady + " PLAYERS READY");
//         io.to(STATE.playing).emit("allReady", true);
//       } else {
//         io.to(STATE.playing).emit("allReady", false);
//       }
//     } else {
//       if (connections[socket.id].ready) numPlayersReady--;
//       connections[socket.id].ready = false;
//       // readyList.splice(readyList.findIndex(connections[socket.id].name), 1);

//       let newPlayers = [];
//       for (let p of readyList)
//         if (p != connections[socket.id].name) newPlayers.push(p);

//       readyList = newPlayers;

//       io.to(STATE.playing).emit("readyPlayers", readyList);

//       io.to(STATE.playing).emit("allReady", false);
//     }
//     // console.log("NUM PLAYERS READY : : :: :: : " + numPlayersReady);
//     // console.log("NUM PLAYERS PLAYING " + numPlaying);
//   });


//   // for when a player lost
//   socket.on("playerLost", async () => {
//     if (gameInProgress) {
//       numPlaying--;
//       losers.push(connections[socket.id].name);
//       console.log(losers);

//       await socket.join(STATE.lost);
//       io.to(STATE.lost).emit("losers", losers); // sending the latest data of all the losers
  
//       if (numPlaying == 1) {
//         // there is a winner
//         for (let c of Object.keys(connections)) {
//           if (!losers.includes(connections[c].name) && connections[c].playing) {
//             losers.push(connections[c].name);
//             await connections[c].socket.join(STATE.lost);
//             io.to(STATE.lost).emit("losers", losers);
//             break;
//           }
//         }
  
//         reset();
//         io.emit("finished", null);
//       }
//     }
//   });

//   socket.on("gameStart", () => {
//     for (let c of Object.keys(connections)) {
//         if (connections[c].name != undefined) {
//             connections[c].playing = true;
//         }
//     }

//     gameInProgress = true;
//     io.to(STATE.playing).emit("start", null); // for when the game starts
//     io.to(STATE.playing).emit("timeToResetMusic", Date.now() + 4000); // set time in future for clients to sync music
//   });

//   socket.on("rtt", (timestamp) => {
//     socket.emit("rtt", timestamp);
//   });
// });

// function reset() {
//   // connections = {}; // list of connection ids
//   for (let c of Object.keys(connections)) {
//     connections[c].socket.leave(STATE.playing);
//     connections[c].socket.leave(STATE.lost);
//     connections[c].socket.leave(STATE.waiting);
//     connections[c].ready = false;
//     connections[c].playing = false;
//   }

//   players = []; // name of the players
//   losers = [];
//   readyList = [];
//   numPlayersReady = 0;
//   numPlaying = 0;
//   gameInProgress = false;
// }

// // send the threshold value
// setInterval(() => {
//   let max = 2;
//   let min = 0.5;
//   let x = Math.random() * (max - min) + min;
//   x = Math.floor(x*2)/2.0;
//   // console.log("POGGERS X: " + x);
//   io.to(STATE.playing).emit("threshhold", x);
// }, 4000);

// // Send server timestamp
// setInterval(() => {
//   io.to(STATE.playing).emit("serverTime", Date.now());
// }, 100);