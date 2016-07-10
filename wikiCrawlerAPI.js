var request = require('request');
var cheerio = require('cheerio');
var URL = require('url-parse');

var START_URL = "https://en.wikipedia.org/wiki/Sachin_Tendulkar";
var MAX_PAGES_TO_VISIT = 100;

var pagesVisited = {};
var pagesVisitedArray = [];
var pagesToVisit = [];
var numPagesVisited = 0;

var url = new URL(START_URL);
var baseUrl = url.protocol + "//" + url.hostname;

//pagesToVisit.push(START_URL);


exports.runAround = function(req,res){
  console.log(" query parameter " + req.query.url);
  START_URL = req.query.url;
  pagesToVisit.push(START_URL);
  crawl(res);
}
function crawl(res){
   if(numPagesVisited >= 100 ) {
      console.log(" Oh we reached the limit. Stopping now");
      res.send(pagesVisitedArray);
   }

   var nextPageToVisit = pagesToVisit.pop();
   if(nextPageToVisit in pagesVisited) {
      //already visited page - stop right here;
      //console.log("alread visited this " + nextPageToVisit);
      res.send(pagesVisitedArray);
   }
   else{
     visitPage(nextPageToVisit, crawl,res);
   }
}

function visitPage(url, callback,res) {
   pagesVisited[url] = true;
   pagesVisitedArray.push(url);
   numPagesVisited++;

   //request and find the first link from the page
   console.log(" visiting page " + url);
   request(url, function(error,response,body){
      if(response.statusCode !== 200) {
        //something happened. can't go ahead
        callback(res);
        return;
      }

      var $ = cheerio.load(body);
      findFirstLinkInBody($);
      callback(res);
   });
}

function findFirstLinkInBody($) {
   //var first = $("#mw-content-text").find('p').first().find('a').first().attr('href');
   var relativePaths = $("#mw-content-text").find('p').first().find('a');
   var skipWord1 = "[note";
   var skipWord2 = "[nb";
   var first = "";
   for(var i=0;i<relativePaths.length; i++) {
       var tempText = $(relativePaths[i]).text();
       if($(relativePaths[i]).attr('href').length == 0)
          continue;
       if((tempText.indexOf(skipWord1) !== -1) || (tempText.indexOf(skipWord2) !== -1)){
         continue;
       }
       else if(tempText.indexOf("[") !== -1) {
          continue;
       }
       else if($(relativePaths[i]).attr('href').toLowerCase().indexOf("wiki/help") !== -1) {
          continue;
       }
       else if($(relativePaths[i]).attr('href').toLowerCase().indexOf("wikipedia:") !== -1) {
          continue;
       }
       else if($(relativePaths[i]).attr('href').toLowerCase().indexOf("wiki/file") !== -1) {
          continue;
       }
       else if($(relativePaths[i]).attr('href').toLowerCase().indexOf(".ogg") !== -1) {
          continue;
       }
       else if($(relativePaths[i]).attr('href').toLowerCase().indexOf(":media") !== -1) {
          continue;
       }
       else if($(relativePaths[i]).attr('title').toLowerCase().indexOf("listen") !== -1) {
          continue;
       }
       else{
         first = $(relativePaths[i]).attr('href');
         break;
       }
   }
   pagesToVisit.push(baseUrl + first);
}
