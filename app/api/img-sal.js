'use strict';
var imageSearch = require('node-google-image-search');
console.log(imageSearch);
module.exports = function(app, History) {

  app.route('/latest')
    // Retrieve most recent searches
    .get(getHistory);
  // .get(handlePost);

  app.get('/:query', handlePost);

  function handlePost(req, res) {
    // Get images and save query and date.

    var query = req.params.query;
    var offset_ID = req.query.offset || 0; // ID number of result you want to offset from
    var size =  req.query.size || 100; // Number of results you want (between 1-10 inclusive)
    
    var history = {
      "term": query,
      "when": new Date().toLocaleString()
    };
    
    
    // Save query and time to the database
    if (query !== 'favicon.ico') {
      save(history);
    }
    /**/
    // Query the image and populate results
    imageSearch(query,
      function(results) {
      console.log(results)
        res.send(results.map(makeList));
      },
      offset_ID,
      size
    );
    /**/
  }

  function makeList(img) {
    // Construct object from the json result
    return {
      "url": img.link,
      "snippet": img.snippet,
      "thumbnail": img.image.thumbnailLink,
      "context": img.image.contextLink
    };
  }

  function save(obj) {
    // Save object into db.

    // create a History document representing the new query (obj)
    var history = new History(obj);
    
    // var promise = history.save();
    // assert.ok(promise instanceof require('mpromise'));
    
    // save to MongoDB
    history.save(function(err, history) {
      if (err) throw err;
      console.log('Saved ' + history);
    });
  }

  function getHistory(req, res) {
    // Check to see if the site is already there
    History.find({}, null, {
      "limit": 10,
      "sort": {
        "when": -1
      }
    }, function(err, history) {
      if (err) return console.error(err);
      console.log("history follows:");
      console.log(history);
      res.send(history.map(function(arg) {
        // Displays only the field we need to show.
        return {
          term: arg.term,
          when: arg.when
        };
      }));
    });
  }

};