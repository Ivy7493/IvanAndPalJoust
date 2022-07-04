const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const bodyParser = require('body-parser')
const port = process.env.PORT || 3000
const queueRouter = require('./backend/routes/queueRoutes.js')


app.get('/', (req, res) => {
  res.json('/Queue')
});

io.on('connection', (socket) => {
  console.log('a user connected');
});

app.get('/Queue',queueRouter)

server.listen(port, () => {
  console.log(`listening on ${port}`);
});