var neighbours = []; // count depends on the country
var europeCountries = []; // 50 countries
var options = []; // 15 options
var wrong = 0;
var correct = 0;
var europeCountryCodes= [];
var currentCountryCode = null;
var currentCountryName = null;
var levelConf = null;

$( document ).delegate("#gpsQuestioning", "pageinit", function() {
    getEuropeCountries();
    $('#level1').click(function() {
        console.log('start gps (level 1)');
        $('#levels').css('display', 'none');
        submitStart({game: 'gpsQuestioning', level: 'level1'});
    });
    $('#level2').click(function() {
        console.log('start gps (level 2)');
        $('#levels').css('display', 'none');
        submitStart({game: 'gpsQuestioning', level: 'level2'});
    });
    $('#level3').click(function() {
        console.log('start gps (level 3)');
        $('#levels').css('display', 'none');
        submitStart({game: 'gpsQuestioning', level: 'level3'});
    });
});

function startGpsQuestioning(data) {
    levelConf = data.levelConf;
    geolocation();
}

function getEuropeCountries() {
    europeCountries = [];
    var europeCountriesUrl = "http://api.geonames.org/childrenJSON?geonameId=6255148&username=adifah"
    $.getJSON(europeCountriesUrl, function(data) {
        $.each(data.geonames, function(key, value) {
            europeCountries.push(value.name);
            europeCountryCodes.push(value.countryCode);
        });
    });
}

function geolocation() {
    correct= 0;
    wrong = 0;
    options = [];
    neighbours = [];
    navigator.geolocation.getCurrentPosition(geolocation_action, errors_action);
}

function errors_action(error) {
    switch(error.code){
        case error.PERMISSION_DENIED: alert("permission denied by user");break;
        case error.POSITION_UNAVAILABLE: alert("geodata unavailable");break;
        default: alert ("unknown Error");break;
    }
}

function geolocation_action(position){
    var browserbreite = 200;
    var karte_url = "http://maps.google.com/maps/api/staticmap?sensor=true&center="+ position.coords.latitude +","+ position.coords.longitude +"zoom=15&size="+ browserbreite +"x250&markers=color:red|label:A|"+ position.coords.latitude +","+ position.coords.longitude;
    
    determineNeighbours(position);
    /*
    jQuery("#karte").html("");
    jQuery("#karte")
        .append(jQuery(document.createElement("img")).attr("src", karte_url).attr('id','karteAktuell'))
        .append(jQuery('<p>').html("longitude: " + position.coords.longitude))
        .append(jQuery('<p>').html("latitude: " + position.coords.latitude));
        */
}

function determineNeighbours(position) {
    var countryCodeUrl = "http://api.geonames.org/countryCodeJSON?lat=" + position.coords.latitude + "&lng=" + position.coords.longitude + "&username=adifah";
    $.getJSON(countryCodeUrl, function(data) {
        if(!currentCountryCode) {
            currentCountryCode = data.countryCode;
        } else {
            currentCountryCode = europeCountryCodes[parseInt( Math.random()*50 )];
        }
        var countryInfoUrl = "http://api.geonames.org/countryInfoJSON?country=" + currentCountryCode + "&username=adifah";
        $.getJSON(countryInfoUrl, function(data2) {
            currentCountryName = data2.geonames[0].countryName;
            var currentCountryGeonameId = data2.geonames[0].geonameId;
            var neighboursUrl = "http://api.geonames.org/neighboursJSON?formatted=true&geonameId=" + currentCountryGeonameId + "&username=adifah";
            jQuery("#neighbours").html("<h3>Your country:</b> " + currentCountryName + " (population: " + data2.geonames[0].population + ")</h3><h1>What are the neighbouring countries of " + currentCountryName + "?</h1>");
            $.getJSON(neighboursUrl, function(data3) {
                printOptions(data3);
            });
        });
    });
}

function printOptions(data) {
    var geonames = data.geonames;
    for (var key in geonames) {
      if (geonames.hasOwnProperty(key)) {
        neighbours.push(geonames[key].countryName);
      }
    }
    europeCountries.sort(randomSort);
    
    for(var i=0;i<levelConf.options;i++) {
        if(i<neighbours.length) {
            options[i] = neighbours[i];                
        } else {
            randomCountryName = europeCountries[parseInt( Math.random()*49 )];
            var index = $.inArray(randomCountryName , options);
            if(index == -1) {
                options[i] = randomCountryName;
            } else {
                i--;
            }
        }
    }
    options.sort(randomSort);
    $('#neighbours').append("<button data-inline='true' class='neighbour'>" + options.join("</button><button data-inline='true' class='neighbour'>") + "</button>").trigger( "create" );;
    
    $('.neighbour').click(function() {
        var name = $(this).html();
        var index = $.inArray(name, neighbours);
        if( index > -1) {
            $(this).css('background-color','green');
            neighbours[index] = null;
            if(++correct === neighbours.length) {
                var points = levelConf.pointsForCorrectCountry * correct + (levelConf.pointsForFail * wrong)
                //var points = 1400 - (50 * wrong);
                points = points < 0 ? 0 : points;
                submitScore({'gameName': 'gpsQuestioning', 'score': points, 'level': levelConf.level});
                alert("you've found all " + correct + " neighbours with " + wrong + " mistakes (" + points + " points)");
                $('#neighbours').html("");
                $('#levels').css('display', 'block');
            }
        } else {
            $(this).css('background-color','red');
            wrong++;
        }
        $(this).unbind('click');
    });
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