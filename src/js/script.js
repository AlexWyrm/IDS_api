'use strict';
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

//IE hack
if (!Array.prototype.includes) {
    Array.prototype.includes = function (element) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] === element)
                return true
        }
        return false;
    }
}

//It is assumed that there is only one geographical object for any given name
var findSelfOrChildren = function (array, parents, parentName, geo) {
    var res = [];
    for (var i = 0; i < array.length; i++) {
        var element = array[i];

        if (element.name === geo) {
            return [element.name];
        }

        if (parents.includes(element[parentName]))
            res.push(element.name);
    }
    return res;
};

var population = function (geo) {
    var responses = {};
    for (var i = 0; i < 3; i++) {
        var request = requests[i];
        var callback = function (request) {
            return function (error, result) {
                if (error) {
                    printResult('API returned error: ' + error);
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
                    var parents = [geo];
                    parents = findSelfOrChildren(responses['/countries'], parents, 'continent', geo);
                    parents = findSelfOrChildren(responses['/cities'], parents, 'country', geo);

                    var p = parents.reduce(function (acc, x) {
                        for (var i = 0; i < responses['/populations'].length; i++) {
                            var cityPop = responses['/populations'][i];
                            if (cityPop.name === x)
                                return acc + cityPop.count;
                        }
                        return acc;
                    }, 0);

                    if (p != 0) {
                        printResult('Total population in ' + geo + ': ' + p);
                    } else {
                        printResult(geo + ' was not found');
                    }

                }
            };
        };

        getData(request, callback(request));
    }
};

var output = document.getElementById("output");

var printResult = function (result) {
    console.log(result);
    output.innerHTML = result;
};
