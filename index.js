const express = require('express');
const path = require('path')
const http = require('http');
const bodyParser = require('body-parser');
const queueRouter = require('./backend/routes/queueRoutes.js');
const GameSocket = require('./backend/socket/gameSocket.js');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const bodyParser = require("body-parser");
const port = process.env.PORT || 3000;
const queueRouter = require("./backend/routes/queueRoutes.js");
const IndentityRouter = require("./backend/routes/identityRoutes.js");
app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "./backend/scripts")));

app.use(express.static("frontend/thisWayUp/dist/this-way-up"));

app.get("/", (_, res) => {
  res.redirect("/index.html");
});

io.on("connection", (_) => {
  console.log("a user connected");
});

app.get("/Queue", queueRouter);
app.get("/Indentity", IndentityRouter);

server.listen(port, () => {
  console.log(`listening on http://localhost:${port}`);
});
