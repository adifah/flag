var resultMap,
    lastTile = null,
    moves = 0,
    pairs = 0,
    mistakes = 0,
    board = '#board',
    isPending = false,
    levelConf = null;

$( document ).delegate("#memorize", "pageshow", function() {
    $('#level1').click(function() {
        console.log('start memorize (level 1)');
        $('#levels').css('display', 'none');
        submitStart({game: 'memorize', level: 'level1'});
    });
    $('#level2').click(function() {
        console.log('start memorize (level 2)');
        $('#levels').css('display', 'none');
        submitStart({game: 'memorize', level: 'level2'});
    });
    $('#level3').click(function() {
        console.log('start memorize (level 3)');
        $('#levels').css('display', 'none');
        submitStart({game: 'memorize', level: 'level3'});
    });
});

function startMemorize(data) {
    levelConf = data.levelConf;
    pairs = 0;
    moves = 0;
    mistakes = 0;
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
    var backValue;
    var frontValue = '<img src="/images/flags/Euro.png" />';
    if(country.type === 'flag') {
        backValue = '<img src="' + country.value + '" />';
    } else {
        backValue = country.value;
    }
    var backSideHtml = $('<div>').addClass('back').addClass('side').html(backValue),
        frontSideHtml = $('<div>').addClass('front').addClass('side').html(frontValue);
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
    if(isTileKnown(currentTile)) {
        mistakes++;
    }
    if(isTileKnown(lastTile)) {
        mistakes++;
    }
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
        var points = ((resultMap.length/2) * levelConf.pointsForMatch) + (mistakes * levelConf.pointsForFail);
        points = points < 0 ? 0 : points;
        submitScore({'gameName': 'memorize', 'score': points, 'level': levelConf.level});
        alert("you've finished the game in " + moves + " moves with " + mistakes + " mistakes (" + points + " points in " + time + " seconds)");
        restart();
    }, 1000);
}

function restart() {
    isPending = true;
    $(board).children().each(function () {
        $(this).removeClass("flipped");
    });
    setTimeout(function () {
        //$('#board').html("");
        //$('#levels').css('display', 'block');
        $.mobile.changePage( "memorize", { reloadPage : true } );
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

function isTileKnown(tile) {
    var card = resultMap[tile.attr('id')];
    if(card.known == null) {
        card.known = true;
        return false;
    } else {
        return true;   
    }
}