
/*
 * GET home page.
 */

exports.index = function(req, res){
  //if req.path contains raw set to raw else pages
  var dir = req.path.indexOf('raw') > 0 ? 'raw' : 'pages';
  res.render(dir + '/index', { title: 'Express' });
};
