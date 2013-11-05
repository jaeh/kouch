"use strict";

var path = require('path')
  , async = require('async')
  , dbs = require(path.join(__dirname, '..', 'db'))
  , hosters = ['youtube'];

var items = exports.items = [];

var itemModel = exports.itemModel = {
    title: {type: 'string'}
  , url: {type: 'string', subtype: 'url'}
  , hoster: {type: 'string', subtype: 'hoster'}
};


var urlCheck = exports.urlCheck = function(url) {
  return true;
}

var hostCheck = exports.hostCheck = function (hoster) {
  //~ hosters.forEach(function (host) {
    //~ if (hoster === host) {
      //~ console.log('compare hosters: ' + hoster + ' and ' + host);
      //~ return true;
    //~ }
  //~ });

  return true;
}

var get = exports.get = function (cb) {
  dbs.session.findOne({slug: 'default'}, function (err, session) {
    dbs.playlist.findOne({_id: session.currentPlaylist}, function (err, pl) {
      dbs.media.find({'id': {$in: pl.items}}, function (err, mediaFiles) {
        pl.items = mediaFiles;
        if (typeof cb === 'function') { cb(null, pl); }
      });
    });
  });
}

var checkModel = exports.checkModel = function(model, obj) {
  var errors = []
    , key
    , found;

  for (key in model) {
    if (model.hasOwnProperty(key)) {
      if (!obj[key]) {
        errors.push('missing needed field: ' + key + ' in object: ' + obj);
      } else {
        if (typeof obj[key] !== model[key].type) {
          errors.push('type error wanted type was: ' + model[key].type + ' in field: ' + key + ' type was: ' + typeof obj[key]);
        }

        if (model[key].subtype) {
          //check urls:
          if (model[key].subtype === 'url' && !urlCheck(obj[key])) {
            errors.push('url error: key was: ' + key + '. model wanted an url but got ', obj[key]);
          }
          if (model[key].subtype === 'hoster') {
            console.log('key = ' + key + ' obj[key] = ' + obj[key] + ' boolean =' + obj[key] === 'youtube');
            if (!hostCheck(obj[key])) {
              errors.push('host check error: key was: ' + key + '. model wanted a hoster but got ', obj[key]);
            }
          }
        }
      }
    }
  }
  //if errors.length > 0 return errors else return null
  return errors.length > 0 ? errors : null;
}

var add = exports.add = function (items, cb) {
  async.waterfall([
    function (callback) {
      for (var key in items) {
        var errors = checkModel(itemModel, items[key]);

        if (errors) {
          errors.forEach(function (error) {
            console.log('removed item because of error:');
            console.warn(error);
          });
          
          delete items[key];
        }
      }

      if (items.length > 0) {
        callback(null, items);
      } else {
        cb('all items had errors that prevented them from being saved to the db');
      }
    },
    function (items, callback) {
      dbs.session.findOne({slug: 'default'}, function (err, session) {
        console.log('playlist add called with items = ', items);
        callback(null, session, items);
      });
    },
    function (session, items, callback) {
      dbs.playlist.findOne({_id: session.currentPlaylist}, function url(err, pl) {
        console.log('err = ' + err);
        pl.items = pl.items || [];
        callback(null, pl, session, items);
      });
    },
    function (pl, session, items, callback) {
      console.log('playlist length before add: ' + pl.items.length);

      async.each(items, function(item, cbb) {
        console.log('adding item to playlist ', item);
        
        item.date = new Date();
        console.log('updating media file: ' + item.id);

        dbs.media.update({id: item.id}, item, {upsert: true}, function (err, numReplaced) {
          pl.items.push(item.id);

          cbb(null);
        });
      }, function (err) {
        dbs.playlist.update({_id: session.currentPlaylist}, pl, {upsert: true}, function (err, numReplaced) {

          if (typeof cb === 'function') { cb(null, pl); }
        });
      });
    }
  ]);
}

var del = exports.del = function(itemid) {
  dbs.session.findOne({slug: 'default'}, function (err, session) {
    dbs.playlist.findOne({_id: session.currentPlaylist}, function (err, pl) {
      var key;
      for (key in pl.items) {
        if (pl.items[key].id === itemid) {
          delete pl.items[key];
        }
      }

      if (typeof cb === 'function') { cb(null, pl); }
    });
  });
};
