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

    // Start with the first array as a base.
    var firstArray = arrays[0];
    var otherArrays = arrays.slice(1);

    // Filter the items that aren't in all other arrays
    var results = firstArray.filter(function(item) {
        // Go through all of the other arrays to make sure
        // they contain this item at least once.
        for(var i = 0; i < otherArrays.length; i += 1) {
            // Assume that the current element is missing until
            // we find it.
            var missingInI = true;

            var array2 = otherArrays[i];
            for(var j = 0; j < array2.length; j += 1) {
                // If it's found, flag that and stop going through the rest
                // of this array.
                if(arrayEquals(array2[j], item)) {
                    missingInI = false;
                    break;
                }
            }

            // We went through this whole array and didn't find it, so we know
            // this item will get filtered and we can directly return false without
            // bothering to check further arrays.
            if(missingInI) {
                return false;
            }
        }
        // We found this item in all the arrays that were passed,
        // so it should remain.
        return true;

    });
    return results;
};

/*
//For testing:
a = [['a', 'b'], ['d', 'e'], ['f', 'v']];
b = [['a', 'b'], ['d', 'e'], ['f', 'x']];

console.log(arrayIntersect([a, b]));
*/
