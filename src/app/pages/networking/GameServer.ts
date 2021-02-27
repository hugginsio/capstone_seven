const io = require('socket.io')(8000, {
    cors: {
        origin: "*",
    },
})

let users = {};

io.on('connection', socket => {

    socket.emit("connected", "You have succefully connected to the socket server!");

    socket.on('new-user', username => {
        users[socket.id] = username;
        socket.broadcast.emit("player-join", "A new player has joined");
    });

    socket.on('send-chat-message', message => {
        //logic
    });

    socket.on('disconnect', () => {
        socket.broadcast.emit('user-disconnected', users[socket.id]);
        delete users[socket.id];
    });

    socket.on('create-lobby', () => {
        //logic
    });
});