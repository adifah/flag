var resultMap,
    lastTile = null,
    moves = 0,
    pairs = 0,
    countries = ["Germany", "China", "USA", "Russia", "Israel", "Spain"],
    board = '#board',
    isPending = false;

$( document ).delegate("#memorize", "pageinit", function() {
    $('#level1').click(function() {
        console.log('start memorize (level 1)');
        $('#levels').html("");
        submitStart({game: 'memorize', level: 1});
    });
    $('#level2').click(function() {
        console.log('start memorize (level 2)');
        $('#levels').html("");
        submitStart({game: 'memorize', level: 2});
    });
    $('#level3').click(function() {
        console.log('start memorize (level 3)');
        $('#levels').html("");
        submitStart({game: 'memorize', level: 3});
    });
});

function start() {
    pairs = 0;
    moves = 0;
    lastTile = null;
    $(board).html("");
    resultMap = createMemoryBoard(countries, board);
    isPending = false;
}

function createMemoryBoard(countries, board) {
    var x,
        map = {},
        tiles = createTiles(countries, 2),
        clear = $("<div>").css("clear", "both");
    for (x = 0; x < tiles.length; x++) {
        map[x] = tiles[x].country;
        $(board).append(tiles[x].html.attr('id', x));
    }
    $(board).append(clear);
    return map;
}

function createTiles(countries, tileFrequency) {
    var x,
        tiles = [];
    for (x = 0; x < countries.length; x++) {
        for (frequency = 0; frequency < tileFrequency; frequency++) {
            tileIndex = x * tileFrequency + frequency;
            tiles[tileIndex] = createTile(countries[x]);
        }
    }
    return shuffleTiles(tiles);
}

function createTile(country) {
    var tile = {},
        backSideHtml = $('<div>').addClass('back').addClass('side'),
        frontSideHtml = $('<div>').addClass('front').addClass('side').html("&nbsp;");
    tile.html = $('<div>').addClass('tile').click(tileClick).append(frontSideHtml).append(backSideHtml);
    tile.country = country;
    return tile;
}

function tileClick() {
    thisTile = $(this);
    if (!thisTile.hasClass("flipped") && !isPending) {
        unmaskTile(thisTile);
        thisTile.addClass("flipped");
        if (lastTile === null) {
            lastTile = thisTile;
        } else {
            moves++;
            checkMove(thisTile);
        }
    }
}

function checkMove(currentTile) {
    if (getTileName(lastTile) === getTileName(currentTile)) {
        success(currentTile);
    } else {
        fail(currentTile);
    }
    if (pairs === countries.length) {
        finish();
    }
}

function success(currentTile) {
    pairs++;
    isPending = true;
    setTimeout(function () {
        currentTile.addClass("match");
        lastTile.addClass("match");
        lastTile = null;
        isPending = false;
    }, 350);
}

function fail(currentTile) {
    maskTile(lastTile);
    maskTile(currentTile);
    lastTile = null;
}

function unmaskTile(tile) {
    tile.find(".back").html(resultMap[tile.attr('id')]);
}

function maskTile(tile) {
    isPending = true;
    setTimeout(function () {
        isPending = false;
        tile.removeClass("flipped");
    }, 1000);
}

function finish() {
    setTimeout(function () {
        alert("you've finished the game in " + moves + " moves (+" + (moves - countries.length) + ")");
        submitScore({'gameName': 'memorize', 'moves': moves});
        restart();
    }, 1000);
}

function restart() {
    isPending = true;
    $(board).children().each(function () {
        $(this).removeClass("flipped");
    });
    setTimeout(function () {
        start();
    }, 1000);
}

function getTileName(tile) {
    return resultMap[getTileId(tile)];
}

function getTileId(tile) {
    return tile.attr('id');
}

function shuffleTiles(tiles) {
    return tiles.sort(randomSort);
}

/* http://freewebdesigntutorials.com/javaScriptTutorials/jsArrayObject/randomizeArrayElements.htm */
function randomSort(a,b) {
    // Get a random number between 0 and 10
    var temp = parseInt( Math.random()*10 );
    // Get 1 or 0, whether temp is odd or even
    var isOddOrEven = temp%2;
    // Get +1 or -1, whether temp greater or smaller than 5
    var isPosOrNeg = temp>5 ? 1 : -1;
    // Return -1, 0, or +1
    return( isOddOrEven*isPosOrNeg );
}