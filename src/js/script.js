/**
 * Реализация API, не изменяйте ее
 * @param {string} url
 * @param {function} callback
 */
function getData(url, callback) {
    var RESPONSES = {
        '/countries': [
            {name: 'Cameroon', continent: 'Africa'},
            {name: 'Fiji Islands', continent: 'Oceania'},
            {name: 'Guatemala', continent: 'North America'},
            {name: 'Japan', continent: 'Asia'},
            {name: 'Yugoslavia', continent: 'Europe'},
            {name: 'Tanzania', continent: 'Africa'}
        ],
        '/cities': [
            {name: 'Bamenda', country: 'Cameroon'},
            {name: 'Suva', country: 'Fiji Islands'},
            {name: 'Quetzaltenango', country: 'Guatemala'},
            {name: 'Osaka', country: 'Japan'},
            {name: 'Subotica', country: 'Yugoslavia'},
            {name: 'Zanzibar', country: 'Tanzania'},
        ],
        '/populations': [
            {count: 138000, name: 'Bamenda'},
            {count: 77366, name: 'Suva'},
            {count: 90801, name: 'Quetzaltenango'},
            {count: 2595674, name: 'Osaka'},
            {count: 100386, name: 'Subotica'},
            {count: 157634, name: 'Zanzibar'}
        ]
    };

    setTimeout(function () {
        var result = RESPONSES[url];
        if (!result) {
            return callback('Unknown url');
        }

        callback(null, result);
    }, Math.round(Math.random * 1000));
}

/**
 * Ваши изменения ниже
 */
var requests = ['/countries', '/cities', '/populations'];

var population = function (geo) {
    var responses = {};
    for (var i = 0; i < 3; i++) {
        var request = requests[i];
        var callback_wrapper = function (request) {
            return function (error, result) {
                if (error) {
                    console.log('API returned error: ' + error);
                    document.getElementById("output").innerHTML = 'Internal error';
                    return;
                }

                responses[request] = result;
                var l = 0;
                for (var K in responses) {
                    if (responses.hasOwnProperty(K)) {
                        l++;
                    }
                }

                if (l == 3) {
                    var c = [], cc = [], p = 0;
                    for (i = 0; i < responses['/countries'].length; i++) {
                        if (responses['/countries'][i].name === geo) {
                            c.push(responses['/countries'][i].name);
                            break;
                        }
                        if (responses['/countries'][i].continent === geo) {
                            c.push(responses['/countries'][i].name);
                        }
                    }

                    for (i = 0; i < responses['/cities'].length; i++) {
                        if (responses['/cities'][i].name === geo) {
                            cc.push(responses['/cities'][i].name);
                            break;
                        }
                        for (j = 0; j < c.length; j++) {
                            if (responses['/cities'][i].country === c[j]) {
                                cc.push(responses['/cities'][i].name);
                            }
                        }
                    }

                    for (i = 0; i < responses['/populations'].length; i++) {
                        for (var j = 0; j < cc.length; j++) {
                            if (responses['/populations'][i].name === cc[j]) {
                                p += responses['/populations'][i].count;
                            }
                        }
                    }

                    if (p != 0) {
                        console.log('Total population in ' + geo + ": " + p);
                        document.getElementById("output").innerHTML = 'Total population in ' + geo + ": " + p;
                    } else {
                        console.log(geo + " was not found");
                        document.getElementById("output").innerHTML = geo + " was not found";
                    }

                }
            };
        };

        var answer = getData(request, callback_wrapper(request));
        if (answer) {
            document.getElementById("output").innerHTML = answer;
        }
    }
};
document.getElementById("button").addEventListener("click", function () {
    population(window.prompt("Please, enter the name of geographical object: ")
    );
});
