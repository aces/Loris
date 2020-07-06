var arrayEquals = function(array1, array2) {
    // Call the Object.prototype.toString function to determine if this is
    // an array or not. This is the way that jQuery does it, to it should
    // be reliable.
    var ostring = Object.prototype.toString;
    // First make sure we're dealing with arrays.
    if(ostring.call(array1) !== '[object Array]' || ostring.call(array2) !== '[object Array]') {
        // Not arrays, so fall back on the normal equality operator
        return array1 === array2;
    };

    // The arrays have different lengths, so they can't be equal
    if(array1.length !== array2.length) {
        return false;
    }

    // Go through each item from one array, and if it isn't equal to the same
    // index in the second array, it means the whole arrays aren't equal
    for(var i = 0; i < array1.length; i += 1) {
        if(array1[i] !== array2[i]) {
            return false;
        }
    }

    // We've verified that they're the same length and compared each
    // element, therefore they're the same
    return true;
}

var arrayIntersect = function(arrays) {
    // Base cases: the intersection of nothing is empty,
    //             the intersection of a single array is itself.
    if(arrays.length === 0) {
        return [];
    }
    if(arrays.length === 1) {
        return arrays[0];
    }

    var obj = {},
        results = [];

    for(var i = 0; i < arrays.length; i++){
        for(var j = 0; j < arrays[i].length; j++){
            if(i === 0) {
                obj[arrays[i][j]] = 1;
            } else {
                if(obj[arrays[i][j]]){
                    obj[arrays[i][j]]++;
                }
            }
        }
    }

    for(var k in obj) {
        if(obj[k] === arrays.length){
            results.push(k);
        }
    }

    return results;
};

var arrayUnion = function(arrays) {
    // Base cases: the union of nothing is empty,
    //             the union of a single array is itself.
    if(arrays.length === 0) {
        return [];
    }
    if(arrays.length === 1) {
        return arrays[0];
    }

    var results = [],
        obj = {}
        getKey = function(element) {
            return element[0] + "," + element[1];
        };
    for (var i = 0; i < arrays.length; i++){
        for(var j = 0; j < arrays[i].length; j++){
            obj[arrays[i][j]] = arrays[i][j];
        }
    }
    for(var k in obj) {
        results.push(obj[k]);
    }
    return results;
}

var getSessions = function(group) {
    var sessions = [],
        session = []
    for(var i = 0; i < group.children.length; i++) {
        if(group.children[i].session) {
            sessions.push(group.children[i].session);
        }
    }
    if(group.activeOperator == 0) {
        session = arrayIntersect(sessions);
    } else {
        session = arrayUnion(sessions);
    }
    return session;
}

var enumToArray = function(enumString) {
    var tempArray = enumString.split("(")[1].split("'"),
        array = [];
    for(var i = 1; i < tempArray.length; i += 2) {
        array.push(tempArray[i]);
    }
    return array;
}

/*
//For testing:
a = [['a', 'b'], ['d', 'e'], ['f', 'v']];
b = [['a', 'b'], ['d', 'e'], ['f', 'x']];

console.log(arrayIntersect([a, b]));
*/
