"use strict";

var path = require('path')
  , dbs = require(path.join(__dirname, '..', 'db'))
  , playlist = require(path.join(__dirname, 'playlist'))
  , ytDL = require(path.join(__dirname, 'youtube-dl'));

module.exports = function (app, io) {
  io.set('log level', 1); // reduce logging

  io.sockets.on('connection', function (socket) {
    dbs.session.findOne({slug: 'default'}, function (err, session) {
      playlist.get(function (err, pl) {
        socket.emit('playlist.init', {playlist: pl.items, session: session});
      });
    });
    socket.on('playlist.add', function (media) {
      
      ytDL.findLinks(media, function(err, mediaFiles) {

        playlist.add(mediaFiles, function (err, pl) {
          console.log('err = ' + err);
          console.log('AFTER ALL ACTIONS: playlist = ', pl);
          io.sockets.emit('playlist.add', mediaFiles);
        });
      });
    });

    socket.on('playlist.del', function (mediaId) {

      console.log('playlist.del called with id: ' + mediaId);
      io.sockets.emit('playlist.del', media);

      playlist.del(mediaId);
    });
  });
}
