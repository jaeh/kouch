"use strict";

var Kouch = {
    search: {
        max_videos: 12
      , YTurl: 'https://youtube.com/watch?v='
    }
  , mediaFiles: {} //the store for all the files sent to and from this user
  , localStorage: {
        active: false //todo
      , maxStorage: 0
    }
  , playlist: {
      items: []
    , add: function (items) {
        console.log('typeof items = ' + typeof items + ' items = ', items);
        if (typeof items !== 'array' && typeof items !== 'object' ) {
          console.warn('playlist.add needs an array or object of items '); 
          return false;
        }

        for (var key in items) {
          if (items.hasOwnProperty(key)) {
            console.log('adding item to playlist ', items[key]);
            Kouch.playlist.items.push(items[key]);
          }
        }
      }
    , del: function(itemid) {
        Kouch.playlist.items.list.forEach(function(item) {
          if (item.id === itemid) {
            Kouch.playlist.items[key];
          }
        });
      }
  }
  , mediaPlayer: {}
  , socket: io.connect('http://' + window.location.hostname)
  , session: {
      slug: 'default'
    , hostname: ''
    , queue: false
    , play: false
    , skip: false
    , stop: false
    , volume: 65
    , state: ''
    , currentMedia: false
    , currentPlaylist: false
  }
};
