const express = require("express");
const path = require("path");
const http = require("http");
const queueRouter = require("./backend/routes/queueRoutes.js").QueueRoute;
const GameSocket = require("./backend/socket/gameSocket.js");
const bodyParser = require("body-parser");
const indentityRouter = require("./backend/routes/identityRoutes.js");
const GameRouter = require("./backend/routes/gameRoutes.js");
const mainRouter = require('./backend/routes/mainRoutes.js')

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3000;

app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("frontend"));
app.use("/", mainRouter);
app.use("/Queue", queueRouter);
app.use("/Identity", indentityRouter);
app.use("/Game", GameRouter);

server.listen(port, () => {
  console.log(`listening on http://localhost:${port}`);
});
