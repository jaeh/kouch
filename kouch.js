"use strict";

/**
 * Module dependencies.
 */

var path = require('path') 
  , express = require('express')
  , app = express()
  , routeDir = path.join(__dirname, 'routes')
  , routes = { 
        queue: require(path.join(routeDir, 'queue'))
      , search: require(path.join(routeDir, 'search'))
      , history: require(path.join(routeDir, 'history'))
    }
  , lessMiddleware = require('less-middleware')
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server)

  , publicDir = path.join(__dirname, 'public')
  , getRequiredData = require(path.join(__dirname, 'lib', 'getRequiredData.js'))
  //this autoloads ./db/index.js which autoloads all dbs.
  , mediaPlayer = require(path.join(__dirname, 'lib', 'mediaplayer.js'))
  , dbs = require(path.join(__dirname, 'db'))
  , sockets = require(path.join(__dirname, 'lib', 'sockets'))


getRequiredData(app, function () {

  app.set('dbs', dbs); //save reference to dbs globally

  // all environments
  app.set('port', process.env.PORT || 2323);
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'jade');

  app.use(express.favicon());
  app.use(express.logger('dev')); //will only log on dev
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here - its not secret at all, its on github :p'));
  app.use(express.session());
  app.use(app.router);

  app.use(lessMiddleware({
      src: publicDir
    , compress: app.get('env') === 'production'
  }));

  app.use(express.static(publicDir));

  // development only
  if ('development' == app.get('env')) {
    app.use(express.errorHandler());
  }

  app.get('/', routes.queue);
  app.get('/queue', routes.queue);
  app.get('/history', routes.history);
  app.get('/search', routes.search);

  app.get('/raw/queue', routes.queue);
  app.get('/raw/history', routes.history);
  app.get('/raw/search', routes.search);

  server.listen(app.get('port'), function (){
    console.log('Express server listening on port ' + app.get('port'));
  });

  sockets(app, io);

});
