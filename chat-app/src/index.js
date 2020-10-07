const path = require('path')
const express = require("express");
const http = require('http')
const socketio = require('socket.io')

const app = express();
const server = http.createServer(app)
const io = socketio(server)
const port = process.env.PORT;
const publicDirectoryPath = path.join(__dirname, "../public");

// app.use(express.json());
app.use(express.static(publicDirectoryPath));

// const router = new express.Router();
// app.use(router);

io.on("connection", (socket) => {
    console.log("New web socket is connected");
});

server.listen(port, () => {
    console.log("Server is up on port " + port);
});
