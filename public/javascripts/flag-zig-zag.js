var socket = null;

$( document ).delegate("#dashboard", "pageinit", function() {
    if(socket == null) {
        console.log('connecting to socket.io');
        socket = io.connect();
        socket.on('newGame', function (data) {
            console.log("newGame: " + data);
            start();
        });
    }
});

function submitScore(score) {
    socket.emit('score', score);   
}

function submitStart(data) {
    socket.emit('start', data);
}