json2-mod
=========

Douglas Crawford's JSON2, augmented with options to stringify your JSON. Used to power JSON Beautifier the online tool found at [www.csvjson.com](https://www.csvjson.com).

# Purpose
Online tool [JSON Beautifier](https://csvjson.com/json_beautifier) provides the ability to print and format JSON as Javascript to make it more compact. You can:
- Drop quotes on keys
- Use single quotes instead of double quotes

# Usage
Unlike the original JSON2 implementation, JSON2_mod does not akways create a global variable. You can use it as a regular CommonJS module. You can also simply load it as a script in the browser in which case, the `JSON2_mod` global will get created.

json2-mod adds 2 extra arguments to function `stringify`: `dropQuotesOnKeys` and `quoteType`.

Require example:
```
const JSON2_mod = require('./json2-mod.js');

const json = {"pi": "3.14159265359", "e": "2.7182818284", "prime": [2, 3, 5, 7, 11, 13, 17, 19], "1+6": 7};
const prettyJson = JSON2_mod.stringify(json, undefined, 2, true, 'single');
console.log(prettyJson);
```

Loading in browser example:
```
<script type="text/javascript" src="json2-mod.js"></script>
<script>
    const json = {"pi": "3.14159265359", "e": "2.7182818284", "prime": [2, 3, 5, 7, 11, 13, 17, 19], "1+6": 7};
    const prettyJson = JSON2_mod.stringify(json, undefined, 2, true, 'single');
    console.log(prettyJson);
</script>
```

In both cases, you would get this in the console:
```
{
  pi: '3.14159265359',
  e: '2.7182818284',
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
  '1+6': 7
}
```

# Documentation

## Stringifying
`JSON2_mod.stringify(value, replacer, space, dropQuotesOnKeys, quoteType)`
- `value`: any JavaScript value, usually an object or array.
- `replacer`: an optional parameter that determines how object values are stringified for objects. It can be a function or an array of strings.
-`space`: an optional parameter that specifies the indentation of nested structures. If it is omitted, the text will be packed without extra whitespace. If it is a number, it will specify the number of spaces to indent at each level. If it is a string (such as '\t' or '&nbsp;'), it contains the characters used to indent at each level.
- `dropQuotesOnKeys`: an optional parameter to drop quotes on keys, when possible. Useful to represent a Javascript object. Quotes will be dropped only if the key can be declared as a valid Javascript object. Do note that the output will not be valid JSON, but it will be valid Javascript.
- `quoteType`: an optional parameter to specify the quote character. Specify either `double` or `single`. Defaults to `double` quote (") however you can overwrite with a `single` quote ('). Do note that the output will not be valid JSON if you use `single`, but it will be valid Javascript.

This method produces a JSON text from a JavaScript value.

When an object value is found, if the object contains a toJSON method, its toJSON method will be called and the result will be stringified. A toJSON method does not serialize: it returns the value represented by the name/value pair that should be serialized, or undefined if nothing should be serialized. The toJSON method will be passed the key associated with the value, and this will be bound to the value

For example, this would serialize Dates as ISO strings.
```
        Date.prototype.toJSON = function (key) {
            function f(n) {
                // Format integers to have at least two digits.
                return n < 10 ? '0' + n : n;
            }

            return this.getUTCFullYear()   + '-' +
                 f(this.getUTCMonth() + 1) + '-' +
                 f(this.getUTCDate())      + 'T' +
                 f(this.getUTCHours())     + ':' +
                 f(this.getUTCMinutes())   + ':' +
                 f(this.getUTCSeconds())   + 'Z';
        };
```
You can provide an optional replacer method. It will be passed the key and value of each member, with this bound to the containing object. The value that is returned from your method will be serialized. If your method returns undefined, then the member will be excluded from the serialization.

If the replacer parameter is an array of strings, then it will be used to select the members to be serialized. It filters the results such that only members with keys listed in the replacer array are stringified.

Values that do not have JSON representations, such as undefined or functions, will not be serialized. Such values in objects will be dropped; in arrays they will be replaced with null. You can use a replacer function to replace those with JSON values. `JSON.stringify(undefined)` returns undefined.

The optional space parameter produces a stringification of the value that is filled with line breaks and indentation to make it easier to read.

If the space parameter is a non-empty string, then that string will be used for indentation. If the space parameter is a number, then the indentation will be that many spaces.

Example:
```
text = JSON.stringify(['e', {pluribus: 'unum'}]);
// text is '["e",{"pluribus":"unum"}]'


text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
// text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

text = JSON.stringify([new Date()], function (key, value) {
    return this[key] instanceof Date ?
        'Date(' + this[key] + ')' : value;
});
// text is '["Date(---current time---)"]'
```

## Parsing
`JSON2_mod.parse(text, reviver)`
This method parses a JSON text to produce an object or array. It can throw a SyntaxError exception.

The optional reviver parameter is a function that can filter and transform the results. It receives each of the keys and values, and its return value is used instead of the original value. If it returns what it received, then the structure is not modified. If it returns undefined then the member is deleted.

Example:

```
    // Parse the text. Values that look like ISO date strings will
    // be converted to Date objects.
myData = JSON.parse(text, function (key, value) {
    var a;
    if (typeof value === 'string') {
        a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
        if (a) {
            return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                +a[5], +a[6]));
        }
    }
    return value;
});

myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
    var d;
    if (typeof value === 'string' &&
            value.slice(0, 5) === 'Date(' &&
            value.slice(-1) === ')') {
        d = new Date(value.slice(5, -1));
        if (d) {
            return d;
        }
    }
    return value;
});
```

# References
- Original version found here: https://github.com/douglascrockford/JSON-js.
- JSON format description found here: http://json.org/.
- JSON Beautifier found here: https://csvjson.com/json_beautifier.