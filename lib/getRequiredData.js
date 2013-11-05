"use strict";

/****************
 * first get session data from db and inject into session
 * then get current playlist using session data
 * return both.
 */

var path = require('path')
  , async = require('async')
  , dbs = require(path.join(__dirname, '..', 'db'))
  , mediaFiles = require(path.join(__dirname, '..', 'default', 'media.js'));

module.exports = function (app, next) {

  async.waterfall([
    function(callback){
      dbs.session.findOne({slug: 'default'}, function (err, session) {
        if (session) {
          return next();
        }
        callback(null);
      });
    },
    function (callback) {

      console.log('inserting default media files: ', mediaFiles);
      dbs.media.insert([mediaFiles[0], mediaFiles[1]], function (err, media) {
        var playlist = {title: 'default', slug: 'default', date: new Date(), items: []};

        media.forEach(function(med) {
          playlist.items.push(med.id);
        });
        callback(null, media, playlist);
      });
    },
    function (media, playlist, callback) {
      console.log('inserting default playlist: ', playlist);
      dbs.playlist.insert(playlist, function (err, pl) {
        
        app.set('playlist', pl);
        callback(null, media, pl);
      });
    },
    function(media, pl, callback) {
      var session = {
          slug: 'default'
        , ip: '127.0.0.1'
        , queue: false
        , play: false
        , skip: false
        , stop: false
        , volume: 65
        , state: ''
        , currentMedia: media[0]._id
        , currentPlaylist: pl._id
      };
      dbs.session.insert(session, function (err, sess) {
        console.log('session set to ', sess);
        app.set('session', sess);
        next();
      });
    }
  ]);
}

