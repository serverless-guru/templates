var express = require("express");
var app = express();

app.get('/', (req, res) => {
    console.log('req', req);
    res.end(JSON.stringify({message: 'hello'}));
})

app.get('/test', (req, res) => {
    console.log('req', req);
    res.end(JSON.stringify({message: 'test'}));
})

app.listen(3000, () => {
    console.log("server connected :)");
});
