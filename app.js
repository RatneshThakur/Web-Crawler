var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var crawler = require('./wikiCrawlerAPI');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));

var routes = require("./routes/routes.js")(app);

app.get("/crawl" , crawler.runAround);

var server = app.listen(3000, function(){
  console.log("Listening on port %s ....." + server.address().port);
});
