"use strict";
Array.prototype.intersect = function (arrays) {
    var i, intersection = [], missing = false, val, el, array;
    for (el in this) {
        if (this.hasOwnProperty(el)) {
            val = this[el];
            missing = false;
            for (i = 0; i < arrays.length; i += 1) {
                array = arrays[i];
                if (array.contains(val) === false) {
                    missing = true;
                    break;
                }
            }
            if (!missing) {
                intersection.push(val);
            }
        }
    }
    return intersection;
};

Array.prototype.equals = function (other) {
    var i;
    if (!(other instanceof Array)) {
        return false;
    }
    if (this.length !== other.length) {
        return false;
    }
    for (i = 0; i < this.length; i += 1) {
        if (this[i] !== other[i]) {
            return false;
        }
    }

    return true;
};

Array.prototype.xlastIndexOf = function (value) {
    var i;
    for (i = 0; i < this.length; i += 1) {
        if ((this[i] && this[i].equals && this[i].equals(value))
                || (this[i] === value)) {
            return i;
        }
    }
    return -1;
};

Array.prototype.contains = function (value) {
    var i;
    for (i = 0; i < this.length; i += 1) {
        if ((this[i] && this[i].equals && this[i].equals(value))
                || (this[i] === value)) {
            return true;
        }
    }
    return false;
};


Array.prototype.unique = function () {
    var r = [], i, j, alreadyAdded;
    for (i = 0; i < this.length; i += 1) {
        alreadyAdded = false;
        for (j = 0; j < r.length; j += 1) {
            if (r[j] === this[i]) {
                alreadyAdded = true;
                break;
            }
        }
        if (alreadyAdded !== true) {
            r[j] = this[i];
        }
    }
    return r;
};

function isNumber(x) {
    return x == parseFloat(x);
}

Array.prototype.min = function () {
    var i, t_min;
    for (i = 0; i < this.length; i += 1) {
        if (t_min === undefined) {
            if (isNumber(this[i])) {
                t_min = this[i];
            }
        } else if (this[i] < t_min) {
            if (isNumber(this[i])) {
                t_min = this[i];
            }
        }
    }
    return t_min;
};

Array.prototype.max = function () {
    var i, t_max;

    for (i = 0; i < this.length; i += 1) {
        if (t_max === undefined) {
            if (isNumber(this[i])) {
                t_max = this[i];
            }
        } else if (this[i] > t_max) {
            if (isNumber(this[i])) {
                t_max = this[i];
            }
        }
    }
    return t_max;
};
