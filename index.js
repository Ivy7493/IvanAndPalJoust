const express = require("express");
const path = require("path");
const http2Express = require("http2-express-bridge");
const http2 = require("http2");
const queueRouter = require("./backend/routes/queueRoutes.js").QueueRoute;
const GameSocket = require("./backend/socket/gameSocket.js");
const bodyParser = require("body-parser");
const indentityRouter = require("./backend/routes/identityRoutes.js");
const GameRouter = require("./backend/routes/gameRoutes.js");
const mainRouter = require("./backend/routes/mainRoutes.js");
const { readFileSync } = require("fs");
const WaitRouter = require("./backend/routes/waitingRoutes.js");

const app = http2Express(express);
const port = process.env.PORT || 3000;

app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("frontend"));
app.use("/", mainRouter);
app.use("/Queue", queueRouter);
app.use("/Identity", indentityRouter);
app.use("/Game", GameRouter);
app.use("/AwaitFinish", WaitRouter);

const options = {
  key: readFileSync("server.key"),
  cert: readFileSync("server.crt"),
  allowHTTP1: true,
};
const server = http2.createSecureServer(options, app);
server.listen(port);
