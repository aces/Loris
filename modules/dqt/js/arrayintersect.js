export const arrayEquals = function(array1, array2) {
    // Call the Object.prototype.toString function to determine if this is
    // an array or not. This is the way that jQuery does it, to it should
    // be reliable.
    const ostring = Object.prototype.toString;
    // First make sure we're dealing with arrays.
    if (ostring.call(array1) !== '[object Array]'
      || ostring.call(array2) !== '[object Array]') {
        // Not arrays, so fall back on the normal equality operator
        return array1 === array2;
    };

    // The arrays have different lengths, so they can't be equal
    if (array1.length !== array2.length) {
        return false;
    }

    // Go through each item from one array, and if it isn't equal to the same
    // index in the second array, it means the whole arrays aren't equal
    for (let i = 0; i < array1.length; i += 1) {
        if (array1[i] !== array2[i]) {
            return false;
        }
    }

    // We've verified that they're the same length and compared each
    // element, therefore they're the same
    return true;
};

export const arrayIntersect = function(arrays) {
    // Base cases: the intersection of nothing is empty,
    //             the intersection of a single array is itself.
    if (arrays.length === 0) {
        return [];
    }
    if (arrays.length === 1) {
        return arrays[0];
    }

    let obj = {};
    let results = [];

    for (let i = 0; i < arrays.length; i++) {
        for (let j = 0; j < arrays[i].length; j++) {
            if (i === 0) {
                obj[arrays[i][j]] = 1;
            } else {
                if (obj[arrays[i][j]]) {
                    obj[arrays[i][j]]++;
                }
            }
        }
    }

    for (let k in obj) {
        if (obj[k] === arrays.length) {
            results.push(k);
        }
    }

    return results;
};

const arrayUnion = function(arrays) {
    // Base cases: the union of nothing is empty,
    //             the union of a single array is itself.
    if (arrays.length === 0) {
        return [];
    }
    if (arrays.length === 1) {
        return arrays[0];
    }

    let results = [];
    let obj = {};
    for (let i = 0; i < arrays.length; i++) {
        for (let j = 0; j < arrays[i].length; j++) {
            obj[arrays[i][j]] = arrays[i][j];
        }
    }
    for (const [k] of Object.entries(obj)) {
        results.push(obj[k]);
    }
    return results;
};

export const getSessions = function(group) {
    let sessions = [];
    let session = [];
    for (let i = 0; i < group.children.length; i++) {
        if (group.children[i].session) {
            sessions.push(group.children[i].session);
        }
    }
    if (group.activeOperator == 0) {
        session = arrayIntersect(sessions);
    } else {
        session = arrayUnion(sessions);
    }
    return session;
};

export const enumToArray = function(enumString) {
  enumString = enumString.substring('enum(\''.length); // remove 'enum('
  enumString = enumString.slice(0, -2); // remove last 2 characters `')`
  const tempArray = enumString.split(/\'\s*,\s*\'/);
  let array = [];
  for (let i = 0; i < tempArray.length; i++) {
    // remove "'" from beginning and end of string
    array.push(tempArray[i]);
  }
  return array;
};

/*
//For testing:
a = [['a', 'b'], ['d', 'e'], ['f', 'v']];
b = [['a', 'b'], ['d', 'e'], ['f', 'x']];

console.log(arrayIntersect([a, b]));
*/
