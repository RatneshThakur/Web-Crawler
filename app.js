var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var crawler = require('./wikiCrawlerAPI');
var stylus = require('stylus');
var nib = require('nib');

function compile(str, path) {
  return stylus(str).set('filename', path).use(nib());
}
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
//app.use(express.logger('dev'));
app.use(stylus.middleware({
  src : __dirname + '/public',
  compile : compile
}));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));

//var routes = require("./routes/routes.js")(app);

app.get("/crawl" , crawler.runAround);
app.get("/", function(req,res){
  res.render('index', {
    title : 'Home'
  });
});

var server = app.listen(3000, function(){
  console.log("Listening on port %s ....." + server.address().port);
});
