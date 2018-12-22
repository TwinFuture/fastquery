// Require the fastquery module.
const fq = require('fastquery');
// If were using http webserver we could pass the req.url like so
let req = '/test/home/?custom1=zing&custom2=zoom&custom3=blah';
// Parse the string...
let query = fq.parse(req);
// Output the parsed query string.
console.log(query);
// Get the value of a specific field
console.log(query.custom1);