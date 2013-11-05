"use strict";

/*
 * GET queue.
 * This will show the currently active queue items
 */

var path = require('path')
  , playlist = require(path.join(__dirname, '..', 'lib', 'playlist'))
  , dbs = require(path.join(__dirname, '..', 'db'));

module.exports = function (req, res) {
  //if req.path contains raw set to raw else pages
  var dir = req.path.indexOf('raw') > 0 ? 'raw' : 'pages';

  playlist.get(function (err, pl) {
    console.log('pl.items = ', pl.items);
    pl.items = dbs.utils.sort(pl.items, ['date']);

    res.render(dir + '/queue', {mediaFiles: pl.items});
  });
};
