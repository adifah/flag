var socket = null;
var gameId = null;
var startTime = 0;
var time = 0;

$( document ).delegate("#dashboard", "pageinit", function() {
    if(socket == null) {
        console.log('connecting to socket.io');
        socket = io.connect();
        socket.on('newGame', function (data) {
            console.log("newGame: " + data);
            startTime = new Date().getTime();
            if(data.type == "memorize") {
                startMemorize(data);
            }
            if(data.type == "gpsQuestioning") {
                startGpsQuestioning(data);
            }
        });
    }
});


function submitScore(data) {
    data.gameId = gameId;
    var requiredTime = (new Date().getTime() - startTime) / 1000;
    time = data.time = Math.round(requiredTime*100)/100
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