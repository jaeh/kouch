"use strict";

jQuery(function($) {
  var lastMediaId
    , searching = false
    , waitForSearch = false;

  function appendSearchResults(results) {
    $('.video').empty();

    results.forEach(function (entry) {
      var entryId = entry.id.$t.split('/')[6]
        , totalSec = entry.media$group.yt$duration.seconds
        , hours = parseInt( totalSec / 3600 ) % 24
        , minutes = parseInt( totalSec / 60 ) % 60
        , seconds = totalSec % 60
        , duration = (hours < 10 ? "0" + hours : hours) + 
                     ":" + (minutes < 10 ? "0" + minutes : minutes) +
                     ":" + (seconds  < 10 ? "0" + seconds : seconds)

        , media = Kouch.mediaFiles[entryId] = {
            description: entry.content.$t
          , title: entry.title.$t
          , originalUrl: Kouch.search.YTurl + entryId
          , author: {
              name: entry.author[0].name.$t
            , url: entry.author[0].uri.$t
          }
          , id: entryId
          , thumbnail: entry.media$group.media$thumbnail[1].url
          , rating: entry.gd$rating
          , duration: duration
          , hoster: 'youtube'
        };

        $('.video').append(
          '<div class="media">'
        +   '<a class="pull-left">'
        +     '<img class="media-object" width="64" height="64" src="' + media.thumbnail + '">'
        +   '</a>'
        +   '<div class="media-body">'
        +     '<h4 class="media-heading">' + media.title + '</h4>'
        +     '<button type="button" class="btn btn-ttc btn-primary addToPlaylist" data-id="' + media.id + '">'
        +       '<span class="glyphicon glyphicon-plus"></span>'
        +       'Add'
        +     '</button>'
        +   '</div>'
        +'</div>');
    });
  }

  function search(query, callback) {

    //early escape if query has less than 3 letters or isnt a string, return false to escape event completely.
    if (query.length < 4 || typeof query !== 'string') { return false; }

    $.get("http://gdata.youtube.com/feeds/api/videos?q=" + query + "&max-results=" + Kouch.search.max_videos + "&alt=json", function(result, error) {
      //exit cleanly with no results. return error message to caller
      if (!result || !result.feed || !result.feed.entry) { return callback("no results"); }
      //return the result and emit null errors
      callback(null, result.feed.entry);
    });
  }

  $('.container').on('keyup click', '#query, #search', function (evt) {
    var query = $('#query').val();
    search(query, function(error, results) {
      if (error) { console.log(error); };

      if (results) {
        appendSearchResults(results);
      }
    });
  });

  $('.container').on('click', '.addToPlaylist', function(evt) {
    var query = $('#query').val()
      , target = $(evt.target)
      , media = Kouch.mediaFiles[target.data('id')];

    //exit early, no harm done.
    if (!media || media.id === lastMediaId) { return false; }

    lastMediaId = media.id;

    Kouch.socket.emit('playlist.add', [media]);
  });
});
