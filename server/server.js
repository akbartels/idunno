const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io").listen(server);


const port = 3000;

function makeId() {
  let result           = '';
  const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const charactersLength = characters.length;
  for ( let i = 0; i < 4; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

//body parser MW
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))

//cors MW
const cors = require('cors');
app.use(cors());

const data = {

}

const initializeRoom  = function() {

}



//Socket.io Lobby
io.on('connection', (socket) => {
  console.log(socket)
  console.log("=================")
  console.log('a user connected', socket.id);
  console.log(socket.client.conn.server.clientsCount + " total users connected")
  console.log("=================")
  
  // socket.emit("dataSentToRoom", "Hello")

  socket.on('createRoom', (ignore, ackFn) => { //change ignore to filters/query
    const roomId = makeId();
    data[roomId] = {cards: [],}

    socket.join(roomId);
    console.log("~~~~~~~~~~~~~~~~~~~~")
    console.log(`*** ${roomId} has`, io.sockets.adapter.rooms[`${roomId}`].length, "user");
    console.log('a user connected', socket.id);
    console.log("~~~~~~~~~~~~~~~~~~~~")
    // console.log("ROOM USERS", io.sockets.adapter.rooms[`${roomId}`].length)
    ackFn(roomId);
    // socket.emit('roomCreated', roomId);
  })

  socket.on('getCardData', (data) => {
    const roomId = Object.keys(socket.rooms)[1];
    console.log("ROOM", roomId)
    // console.log("****PLACES", data)
    socket.in(roomId).emit("dataSentToRoom", data);
  })


  socket.on('joinRoom', (roomId, ackFn) => {
   const room = io.sockets.adapter.rooms[roomId];
    if (!room) {
      console.log('roomId doesn\'t exist', roomId)
      ackFn(false);
    } else {
      socket.join(roomId);
      ackFn(true)
      console.log("~~~~~~~~~~~~~~~~~~~~")
      console.log(socket.id, ' joins room', roomId);
      console.log(`*** ${roomId} has`, io.sockets.adapter.rooms[`${roomId}`].length, "user");
      console.log("~~~~~~~~~~~~~~~~~~~~")
    }
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

//import routes
const sessions = require("./routes/sessions");
const users = require("./routes/users");

//Routes 
// app.use("/api", sessions());
// app.use("/api", users());

server.listen(port, () => {
  console.log('listening on *:3000');
});
