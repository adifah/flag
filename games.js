var idCounter = 0;

var createMemoryGame = function(data, callback) {
    var memoryGame = {};
    memoryGame.level = data.level;
    memoryGame.id = ++idCounter;
    callback(memoryGame);   
}