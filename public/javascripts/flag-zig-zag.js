var socket = null;

$( document ).delegate("#dashboard", "pageinit", function() {
    if(socket == null) {
        console.log('connecting to socket.io');
        socket = io.connect();
    }
});

socket.on('news', function (data) {
    console.log(data);
    socket.emit('score', 10);
});