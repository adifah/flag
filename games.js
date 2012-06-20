var conf = require('./conf');

// in-memory game spooler
var games = [];
var idCounter = 0;

createMemoryGame({level: 'level2'}, function(data) { console.log("game: ", data); });
createMemoryGame({level: 'level3'}, function(data) { console.log("game: ", data); });

function createMemoryGame(data, callback) {
    var memoryGame = {};
    memoryGame.type = "memorize";    
    memoryGame.level = data.level;
    memoryGame.id = ++idCounter;
    var levelConf = conf.memory[memoryGame.level];
    memoryGame.deck = createDeck(levelConf);
    // add game to game spooler (could be a memory leak in long term)
    games[memoryGame.id] = memoryGame;
    callback(memoryGame);
}

// create random card deck based on conf.js' level settings
function createDeck(level) {
    var countries = getRandomCountries(conf.memory.countries, level.pairs);
    var cards = [];
    for(var i=0; i<countries.length; i++) {
        // get random country out of countries
        var country = countries[i];
        cards[i*2] = { 'id': country.name, 'type': level.firstCard, 'value': country[level.firstCard] };
        cards[i*2+1] = { 'id': country.name, 'type': level.secondCard,  'value': country[level.secondCard] };
    }
    // return shuffled cards
    shuffle(cards);
    return cards;
}

function getRandomCountries(countries, count) {
    // shuffle all countries
    shuffle(countries);
    var countryCount = countries.length;
    var result = [];
    // only get 'count' countries
    var maxPairs = count > countryCount ? countryCount : count;
    for(var i=0;i<maxPairs;i++) {
        result[i] = countries[i];
    }
    return result;
}

/*
 * shuffle function using Fisher-Yates algorithm
 * Usage : 
 *  var tmpArray = ["a", "b", "c", "d", "e"];
 *  shuffle(tmpArray);
 */
function shuffle (arrayToShuffle){
    var i = arrayToShuffle.length, j, temp;
    if ( i == 0 ) return;
    while ( --i ) {
        j = Math.floor( Math.random() * ( i + 1 ) );
        temp = arrayToShuffle[i];
        arrayToShuffle[i] = arrayToShuffle[j];
        arrayToShuffle[j] = temp;
    }
};