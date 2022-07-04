const express = require('express');
const path = require('path')
const http = require('http');
const { Server } = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const bodyParser = require('body-parser')
const port = process.env.PORT || 3000
const queueRouter = require('./backend/routes/queueRoutes.js')
const IndentityRouter = require('./backend/routes/identityRoutes.js')
app.use(bodyParser.json({ limit: '100mb' }))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, './backend/scripts')))


app.get('/', (req, res) => {
  res.json('/Queue')
});

io.on('connection', (socket) => {
  console.log('a user connected');
});

app.get('/Queue',queueRouter)
app.get('/Indentity',IndentityRouter)

server.listen(port, () => {
  console.log(`listening on ${port}`);
});