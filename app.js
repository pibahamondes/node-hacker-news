const path = require('path');
const express = require('express');
const hbs = require('hbs');
const he = require('he');

const request = require('request');

const publicPath = path.join(__dirname, 'mainsite');
const port = process.env.PORT || 8080;

var app = express();
app.set('view engine', 'hbs');
app.use(express.static(publicPath));

var title = art => art.title ? art.title : art.story_title ? art.story_title : 'Untitled';
hbs.registerHelper('titler', (art) => title(art));
var body = art => art.comment_text ? art.comment_text : art.story_text ? art.story_text : '';
var url = art => art.url ? art.url : "" ;
hbs.registerHelper('bodier', (art) => he.decode(body(art)));
hbs.registerHelper('urlize', (art) => url(art));

var printArticle = (art) => {
  var s = `Author: ${art.author}\n`;
  s += `Title: ${title(art)}\n`;
  s += `Date: ${art.created_at}\n`;
  s += body(art) + "\n";
  console.log('--------');
  console.log(s)
  console.log('--------');
  return s;
};

var printHits = (hits) => {
  var text = "";
  hits.forEach((art) => {
    text += printArticle(art);
  });
  return text;
};

app.get('/', (req, res) => {
const API = 'http://hn.algolia.com/api/v1/search_by_date?query=nodejs';
request({url: API, json: true}, (error, response, body) =>{
    //printHits(body.hits);
    res.render('../mainsite/index.hbs', {
      hits: body.hits
    });
  }
);
});

app.get('/readMore', (req, res) => {
  res.render('../mainsite/readMore.hbs');
})




app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
