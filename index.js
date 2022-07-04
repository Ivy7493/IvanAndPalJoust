const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const queueRouter = require('./backend/routes/queueRoutes.js');
const GameSocket = require('./backend/socket/gameSocket.js');

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3000;

app.use(bodyParser.json({ limit: '100mb' }));

app.get('/', (req, res) => {
  res.json('/Queue')
});

app.get('/Queue', queueRouter)

const socket = new GameSocket(server);

server.listen(port, () => {
  console.log(`listening on ${port}`);
});
