const Evaluator = require('./Evaluator');

const asserts = [
  ['3.0 = 3', true],
  ['5 + 1', 6],
  ['3.0 - 2', 1],
  ['7 * 12', 84],
  ['10/2', 5],
  ['4^(1/2)', 2],
  ['2^(-1)', 0.5],
  ['[x] + 2', 100], //x = 98 in scope
  ['"[x]" + 2', "[x]2"],
  ['isNaN(3 + "1")', false],
  ['"1,1,1,1 2 2 2"', "1,1,1,1 2 2 2"],
  ["'1,1,1,1'", '1,1,1,1'],
  ['stdev(-1,0,1)', 1],
  ['if([x] = 98, "potato", null)', "potato"],
  ['if([x] = 99, "potato", null)', null],
  ['datediff("2016-01-01", "2017-01-01", "M", "ymd")', 12],
  ['datediff([dob], "2017-01", "y", "ymd")', 24], //dob = 1993-01-01 in scope
  ['datediff("2017-01-01T00:00:00Z", "2017-01-01T17:30:00Z", "h", "ymd")', 17.5],
  ['if(true, 1, 0)', 1],
  ['if(false, 1, 0)', 0],
  ['""', ""],
]

asserts.forEach((test) => {
  const o = Evaluator(test[0], {x: 98, dob: "1993-01-01"});
  if (!(o === test[1])) {
    throw `${test[0]} evaluates to ${o} not ${test[1]}.`
  }
})

console.log('PASSED!');
