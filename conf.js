module.exports = {
    "twit": {
        "consumerKey": 'Er2ax9j6DpI3YX6GLcffsQ',
        "consumerSecret": 'JpOmapaL29ExSL9LBtfB8dYOQND4JwsrN326CTv38'
    },
    "logger": {
        "file" : {
            "filename": 'log.log'
        },
        "loggly": {
            "subdomain": "adifah",
            "inputToken": "55284070-4d63-418e-be8c-f84f9465c357",
            "json": true
        }
    },
    "gpsQuestioning": {
        "level1" : {
            "options" : 10,
            "pointsForCorrectCountry" : 200,
            "pointsForFail" : -50,
            "pointsRequired" : 0
        },
        "level2" : {
            "options" : 10,
            "pointsForCorrectCountry" : 200,
            "pointsForFail" : -50,
            "pointsRequired" : 500  
        },
        "level3" : {
            "options" : 14,
            "pointsForCorrectCountry" : 200,
            "pointsForFail" : -50,
            "pointsRequired" : 1000
        }
    },
    "memory": {
        "level1" : {
            "pairs": 5,
            "firstCard": "flag",
            "secondCard": "flag",
            "pointsRequired": 0,
            "pointsForMatch": 50,
            "pointsForFail": -50
        },
        "level2" : {
            "pairs": 8,
            "firstCard": "flag",
            "secondCard": "name",
            "pointsRequired": 250,
            "pointsForMatch": 50,
            "pointsForFail": -50
        },
        "level3" : {
            "pairs": 8,
            "firstCard": "flag",
            "secondCard": "capital",
            "pointsRequired": 650,
            "pointsForMatch": 50,
            "pointsForFail": -50
        },
        "countries" : [
            {
                "name": "Germany",
                "flag": "/images/flags/Germany.png",
                "capital": "Berlin"
            },
            {
                "name": "France",
                "flag": "/images/flags/France.png",
                "capital": "Paris"
            },
            {
                "name": "Italy",
                "flag": "/images/flags/Italien.png",
                "capital": "Rome"
            },
            {
                "name": "Belgium",
                "flag": "/images/flags/Belgium.png",
                "capital": "Brussels"
            },
            {
                "name": "Netherlands",
                "flag": "/images/flags/Netherlands.png",
                "capital": "Amsterdam"
            },
            {
                "name": "United Kingdom",
                "flag": "/images/flags/Great-Britain.png",
                "capital": "London"
            },
            {
                "name": "Turkey",
                "flag": "/images/flags/Turkey.png",
                "capital": "Ankara"
            },
            {
                "name": "Switzerland",
                "flag": "/images/flags/Switzerland.png",
                "capital": "Bern"
            },
            {
                "name": "Spain",
                "flag": "/images/flags/Spain.png",
                "capital": "Madrid"
            }
        ]
    }
};