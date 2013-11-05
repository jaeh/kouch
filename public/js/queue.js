"use strict";

jQuery(function ($) {
  Kouch.renderQueue = function() {
    console.log('renderqueue called with path: ' + window.location.pathname);

    console.log('Kouch.playlist.items = ', Kouch.playlist.items);

    var queueDiv = $('#queue')
      , playListString = '';

    Kouch.playlist.items.forEach(function (media) {
      var item =  '<div class="media">'
      +             '<a class="pull-left">'
      +               '<img height="64" width="64" src="' + media.thumbnail + '" class="media-object">'
      +             '</a>'
      +             '<div class="media-body">'
      +               '<h4 class="media-heading">' + media.title + '</h4>'
      +               '<button data-id="' + media.id + '" class="btn btn-ttc btn-primary addToPlaylist" type="button">'
      +                 '<span class="glyphicon glyphicon-plus"></span>Add'
      +               '</button>'
      +             '</div>'
      +           '</div>';

      playListString += item;
    });

    queueDiv.html(playListString);
  }
});
