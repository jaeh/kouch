"use strict";

/*
 * GET queue.
 * This will show the currently active queue items
 */

module.exports = function (req, res) {
  //if req.path contains raw set to raw else pages
  var dir = req.path.indexOf('raw') > 0 ? 'raw' : 'pages';

  res.render(dir + '/search');
};
