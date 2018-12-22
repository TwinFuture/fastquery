# Fast Query
#### Fast Query is a lightweight and super fast query string parser for node javascript.
*With fastquery you don't have to parse the querystring from the url first, we do that for you using the most optimized method just send us the req.url for example.*

# Fast Query parses string types...
**`/test/home/?custom1=zing&custom2=zoom&custom3=blah`**

**`custom1=zing&custom2=zoom&custom3=blah`**

**`?custom1=zing&custom2=zoom&custom3=blah`**

# Installation
```
npm i fastquery --save
```
# Usage
### `parse(querystring, options, sep, eq) → {parsedQuery}`
#### Params
| Name | Type | Default |Description |
|--|--|--|--|
| querystring | string | `!required` | The query string you wish to parse |
| options | object | `100` | Currently only features options.maxFields |
| sep | string | `&` | multiple query parameters are separated by the ampersand "`&`" |
| eq | string | `=` | Each separation contains a pair `field=value` |

Assuming you have already installed fastquery
```js
const fq = require('fastquery');
```
We can set our own options to parse our query string such as maxFields..
```js
let options = {
    maxFields: 200
}
let sep = '&';
let eq = '=';
let querystring = '/test/home/?custom1=zing&custom2=zoom&custom3=blah';

let parsed = fq.parse(querystring, options, sep, eq);
console.log(parsed);
```
This is just a basic example of parsing a query and getting the value from one of the custom fields.
# Example
```js
const fq = require('fastquery');
// If were using http webserver we could pass the req.url like so
let req = '/test/home/?custom1=zing&custom2=zoom&custom3=blah'

let query = fq.parse(req);
// Output the parsed query string.
console.log(query);
// Get the value of a specific field
console.log(query.custom1);
```
# Benchmarks
These benchmarks also reflect the jsperf results found here [slice vs substring vs indexof vs regex](https://jsperf.com/slice-vs-substr-vs-substring-vs-split-vs-regexp/2)

First I did a few simple tests and find the best method for splitting a string.

| Method | Time Taken | Output |
| -- | -- | -- |
| split | 1614.155ms | `imsplitthere` |
| indexOf | 2308.475ms | `imsplitthere` |
| slice | 2200.492ms | `imsplitthere` |

From this result, we can clearly see that split, is clearly faster.
So we built our querystring parser based on this regex is slower sorry not included. Maybe later..

Then we tested different methods that I gathered up to see which would be the fastest to parse the whole querystring. I developed the fastest regex, and used the current querystring module to compare against while also using some of that code in our own so its backwards compatible and its nicely written.

| Method | Time Taken | Output |
| -- | -- | -- |
| fastRegex | 8868.756ms | `{custom1:'zing',custom2:'zoom',custom3:'blah'}` |
| querystring | 31618.960ms | `{custom1:'zing',custom2:'zoom',custom3:'blah'}` |
| fastquery | 5160.376ms | `{custom1:'zing',custom2:'zoom',custom3:'blah'}` |

fastquery is the fastest and will parse multiple types of strings. I did benchtest other methods of parsing a string but these 3 stood out... You can replace the decode function on querystring, because its using indexOf it is still slightly slower than fastquery.

fastRegex isn't that far behind.. Its also a very useful regex.

Please checkout the bench.js for source code for the other query string parsers and the full bench test.

# To Do...
- Extra features
- More examples

# Coming soon...
- Possibly fast routing...

## Feedback
Feedback and improvments are always appreciated and help us to improve so please leave some!
## License
Licensed under MIT.




