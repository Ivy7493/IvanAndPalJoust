const express = require('express');
const path = require('path');
const http = require('http');
const queueRouter = require('./backend/routes/queueRoutes.js');
const GameSocket = require('./backend/socket/gameSocket.js');
const bodyParser = require('body-parser');
const indentityRouter = require('./backend/routes/identityRoutes.js');

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3000;

app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, './backend/scripts')));


const socket = new GameSocket(server);

app.use('/Queue', queueRouter);
app.use('/Identity', indentityRouter);
app.get('/', (req, res) => {
  res.json('/Queue')
});

server.listen(port, () => {
  console.log(`listening on ${port}`);
});
