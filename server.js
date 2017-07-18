'use strict';

var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var routes = require('./app/routes/index.js');
var api = require('./app/api/img-sal.js');
require('dotenv').config({
  silent: true
});
var app = express();

var Schema = mongoose.Schema;


/* Derive history from a Schema
    Each Schema maps to a MongoDB collection and defines 
    the shape of the documents within that collection 
*/
var historySchema = new Schema({
  term: String,
  when: String
});


/* Compile our schema into a Model
    A model is a class with which we construct documents. In this case, each document 
    will be a History with properties and behaviours as declared in our schema. 
*/
var History = mongoose.model('History', historySchema); 

var mongouri = process.env.MONGOLAB_URI;
mongoose.connect(mongouri,{useMongoClient: true});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

routes(app);
api(app, History);

var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log('Node.js listening on port ' + port);
});