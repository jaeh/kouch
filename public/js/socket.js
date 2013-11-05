"use strict";

jQuery(function($) {
  Kouch.socket.on('playlist.init', function (data) {
    console.log('PLAYLIST INIT: data = ', data);
    Kouch.playlist.items = data.playlist;
    Kouch.session = data.session;
  });

  Kouch.socket.on('playlist.add', function (media) {
    //WORKS ! :)
    console.log('playlist.add data = ', media);
    console.log('playlist length before add = ' + Kouch.playlist.items.length);
    var b = Kouch.playlist.add(media);
    console.log('playlist length = ' + Kouch.playlist.items.length);
    

    var path = window.location.pathname;

    if (path.indexOf('queue') > -1 || path === '/') {
      console.log('renderQueue called');
      Kouch.renderQueue();
    }
  });

  Kouch.socket.on('playlist.del', function (data) {
    console.log('playlist.del data = ' + data);
  });
});
