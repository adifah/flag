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
            }
        ]
    }
};