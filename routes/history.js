"use strict";

/*
 * GET history.
 * This will show a list of the past queued items.
 */

module.exports = function (req, res) {
  //if req.path contains raw set to raw else pages
  var dir = req.path.indexOf('raw') > 0 ? 'raw' : 'pages';
  
  res.render(dir + '/history');
};
