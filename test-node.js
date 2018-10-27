const JSON2_mod = require('./json2-mod.js');
const json = {"pi": "3.14159265359", "e": "2.7182818284", "prime": [2, 3, 5, 7, 11, 13, 17, 19], "1+6": 7};
const expected = `{
  pi: "3.14159265359",
  e: "2.7182818284",
  prime: [
    2,
    3,
    5,
    7,
    11,
    13,
    17,
    19
  ],
  "1+6": 7
}`;
console.log('==Expected==');
console.log(expected);
const prettyJson = JSON2_mod.stringify(json, undefined, 2, true, "'");
console.log('==Execution==');
console.log(prettyJson);
console.log('==Result==');
if (prettyJson == expected) {
	console.log('Success!');
} else {
	console.log('Failed.');
}
