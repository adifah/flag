var socket = null;
var gameId = null;

$( document ).delegate("#dashboard", "pageinit", function() {
    if(socket == null) {
        console.log('connecting to socket.io');
        socket = io.connect();
        socket.on('newGame', function (data) {
            console.log("newGame: " + data);
            start(data);
        });
    }
});

function submitScore(data) {
    data.gameId = gameId;
    socket.emit('score', data);   
}

function submitStart(data) {
    gameId = null;
    socket.emit('start', data);
}

function submitMove(data) {
    data.gameId = gameId;
    socket.emit('move', data);
}