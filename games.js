var conf = require('./conf');

// in-memory game spooler
var europeCountries = [];
var games = [];
var idCounter = 0;

/*
    createMemoryGame({level: 'level2'}, function(data) { console.log("game: ", data); });
    createMemoryGame({level: 'level3'}, function(data) { console.log("game: ", data); });
*/

exports.init = function () {
    getEuropeCountries();
}

function getEuropeCountries() {
    var europeCountriesUrl = "http://api.geonames.org/childrenJSON?geonameId=6255148&username=adifah"
    $.getJSON(europeCountriesUrl, function(data) {
        $.each(data.geonames, function(key, value) {
            europeCountries.push(value.name);
            europeCountryCodes.push(value.countryCode);
        });
    });
}

exports.createMemoryGame = function (data, callback) {
    var memoryGame = {};
    memoryGame.type = "memorize";    
    memoryGame.level = data.level;
    memoryGame.id = ++idCounter;
    memoryGame.levelConf = conf.memorize[memoryGame.level];
    memoryGame.deck = createDeck(memoryGame.levelConf);
    // add game to game spooler (could be a memory leak in long term)
    games[memoryGame.id] = memoryGame;
    callback(memoryGame);
}

// create random card deck based on conf.js' level settings
function createDeck(level) {
    var countries = getRandomCountries(conf.memorize.countries, level.pairs);
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

exports.createGpsQuestioningGame = function (data, callback) {
    var gpsQuestioningGame = {};
    gpsQuestioningGame.type = "gpsQuestioning";    
    gpsQuestioningGame.level = data.level;
    gpsQuestioningGame.id = ++idCounter;
    gpsQuestioningGame.levelConf = conf.gpsQuestioning[gpsQuestioningGame.level];
    // gpsQuestioningGame.countries = createCountries(levelConf);
    // add game to game spooler (could be a memory leak in long term)
    games[gpsQuestioningGame.id] = gpsQuestioningGame;
    callback(gpsQuestioningGame);
}

function createCountries(gpsQuestioningGame) {
    
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