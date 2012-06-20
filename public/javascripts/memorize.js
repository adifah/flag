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
        submitStart({game: 'memorize', level: 'level1'});
    });
    $('#level2').click(function() {
        console.log('start memorize (level 2)');
        $('#levels').html("");
        submitStart({game: 'memorize', level: 'level2'});
    });
    $('#level3').click(function() {
        console.log('start memorize (level 3)');
        $('#levels').html("");
        submitStart({game: 'memorize', level: 'level3'});
    });
});

function start(data) {
    pairs = 0;
    moves = 0;
    lastTile = null;
    $(board).html("");
    resultMap = createMemoryBoard(data, board);
    isPending = false;
}

function createMemoryBoard(data, board) {
    var x,
        map = [],
        tiles = createTiles(data.deck),
        clear = $("<div>").css("clear", "both");
    for (x = 0; x < tiles.length; x++) {
        map[x] = tiles[x];
        $(board).append(tiles[x].html.attr('id', x));
    }
    $(board).append(clear);
    return map;
}

function createTiles(countries) {
    var x,
        tiles = [];
    for (x = 0; x < countries.length; x++) {
        tiles[x] = createTile(countries[x]);
    }
    return tiles;
}

function createTile(country) {
    var value;
    if(country.type === 'flag') {
        value = '<img src="' + country.value + '" />';
    } else {
        value = country.value;
    }
    var backSideHtml = $('<div>').addClass('back').addClass('side').html(value),
        frontSideHtml = $('<div>').addClass('front').addClass('side').html("&nbsp;");
    country.html = $('<div>').addClass('tile').click(tileClick).append(frontSideHtml).append(backSideHtml);
    return country;
}

function tileClick() {
    thisTile = $(this);
    if (!thisTile.hasClass("flipped") && !isPending) {
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
    if (getTileId(lastTile) === getTileId(currentTile)) {
        success(currentTile);
    } else {
        fail(currentTile);
    }
    if (pairs === resultMap.length/2) {
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

function maskTile(tile) {
    isPending = true;
    setTimeout(function () {
        isPending = false;
        tile.removeClass("flipped");
    }, 1000);
}

function finish() {
    setTimeout(function () {
        alert("you've finished the game in " + moves + " moves (+" + (moves - resultMap.length/2) + ")");
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

function getTileValue(tile) {
    return resultMap[tile.attr('id')].value;
}

function getTileType(tile) {
    return resultMap[tile.attr('id')].type;
}

function getTileId(tile) {
    return resultMap[tile.attr('id')].id;
}