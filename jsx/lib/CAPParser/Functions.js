const moment = require('moment');

module.exports = {
  eq(a, b) {
    return a === b;
  },
  add(a, b) {
    return a + b;
  },
  sub(a, b) {
    return a - b;
  },
  mul(a, b) {
    return a * b;
  },
  div(a, b) {
    return a / b;
  },
  pow(a, b) {
    return Math.pow(a, b);
  },
  mod(a, b) {
    return a % b;
  },
  negate(a) {
    return -a;
  },
  isNaN(a) {
    // Strings aren't numbers?
    return (typeof a === 'string') || isNaN(a);
  },
  round(n, places) {
    const shift = Math.pow(10, places);
    return Math.round(n * shift) / shift;
  },
  roundup(n, places) {
    const shift = Math.pow(10, places);
    return Math.ceil(n * shift) / shift;
  },
  rounddown(n, places) {
    const shift = Math.pow(10, places);
    return Math.floor(n * shift) / shift;
  },
  sqrt(a) {
    return Math.sqrt(a);
  },
  pow(a, b) {
    return Math.pow(a, b);
  },
  abs(a) {
    Math.abs(a);
  },
  min(...ns) {
    Math.min(...ns);
  },
  max(...ns) {
    Math.max(...ns);
  },
  mean(...ns) {
    return ns.reduce((a,b) => a+b, 0) / ns.length;
  },
  median(...ns) {
    if (ns.length === 0) {
      throw 'Cannot find median of 0 arguments'
    }
    const cpy = ns.map(x => x)
    const mid = cpy.length / 2
    cpy.sort();
    if (cpy.length % 2 === 0) {
      return (cpy[mid] + cpy[mid + 1]) / 2;
    } else {
      return cpy[mid + 1];
    }
  },
  sum(...ns) {
    return ns.reduce((a,b) => a + b, 0);
  },
  stdev(...ns) {
    const mean = ns.reduce((a,x) => a + x, 0) / ns.length;
    const variance = ns.reduce((a,x) => {
      return ((x - mean) * (x - mean)) + a
    }, 0) / (ns.length - 1);
    return Math.sqrt(variance);
  },
  // Assuming 24-hour clock
  datediff(date1, date2, units, format = 'ymd', returnSigned = false) {
    let mdate1, mdate2;
    switch (format) {
      case 'ymd': {
        mdate1 = moment(date1, ['YYYY-MM-DD', 'YYYY-MM-DD HH:mm:ss']);
        mdate2 = moment(date2, ['YYYY-MM-DD', 'YYYY-MM-DD HH:mm:ss']);
        break;
      }
      case 'mdy': {
        mdate1 = moment(date1, ['MM-DD-YYYY', 'MM-DD-YYYY HH:mm:ss']);
        mdate2 = moment(date2, ['MM-DD-YYYY', 'MM-DD-YYYY HH:mm:ss']);
        break;
      }
      case 'dmy': {
        mdate1 = moment(date1, ['DD-MM-YYYY', 'DD-MM-YYYY HH:mm:ss']);
        mdate2 = moment(date2, ['DD-MM-YYYY', 'DD-MM-YYYY HH:mm:ss']);
        break;
      }
    }
    const diff = mdate2.diff(mdate1, units);
    if (returnSigned) {
      return diff;
    } else {
      return Math.abs(diff);
    }
  }
}
