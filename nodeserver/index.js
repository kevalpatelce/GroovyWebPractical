const io = require('socket.io')(8000);

const users = {};

io.on('connect', socket =>{
    //socket various event
    socket.on('new-user-join', name => {
        //username store in users
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name)
    });

    socket.on('send', message => {
        socket.broadcast.emit('receive', {message : message, name:users[socket.id]})
    });

    socket.on('disconnect', message => {
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id]
    });

});