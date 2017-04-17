const request = require('request');
const yargs = require('yargs');
const express = require('express');
const hbs = require('hbs');

var app = express();



hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));

hbs.registerHelper('getYear', ()=> new Date().getFullYear());
hbs.registerHelper('screamIt', text => text.toUpperCase());
var title = art => art.title ? art.title : art.story_title ? art.story_title : 'Untitled';
hbs.registerHelper('titleArt', art => title(art));
var body = art => art.comment_text ? art.comment_text : art.story_text;
hbs.registerHelper('bodyArt', art => body(art));
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
hbs.registerHelper('hitsobj', (hits) => {
  var text = "";
  hits.forEach((art) => {
    text += printArticle(art);
  });
  return text;
});

const API = 'http://hn.algolia.com/api/v1/search_by_date?query=nodejs';

app.get('/', (req, res) => {
  request({
    url: API,
    json: true
  }, (error, response, body) =>{
    res.render('index.hbs',{
      pageTitle: 'Home',
      welcomeMessage: 'Welcome to this nice website!',
      hits: body.hits
    });
  });
});

app.listen(8080);
