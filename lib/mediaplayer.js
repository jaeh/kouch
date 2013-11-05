"use strict";

var cp = require('child_process');

exports.getPlayerState = function(){
  return playerState
}

exports.getIP = function(){
  return playerState.ip
}

exports.addToPlaylist = function(type,entry){
  if (type == 'youtube') {
    var pl = Playlist.insert({
      type:type,
      url:entry.url,
      youtubeId:entry.youtubeId,
      title:entry.title,
      thumbnail:entry.thumbnail,
      description:entry.description,
      duration:entry.duration,
      date:Date.now(),
      isPlaying:false
    });

    logger.info('[METHODS][YOUTUBE] ',pl);
    Kouch.update({'_id':kkId._id},{'$push':{ 'playlist':pl}});    
    return pl
  } else if (type == 'api'){
    var pl = Playlist.insert({type:type,
      url:entry,
      title:entry.title,
      date:Date.now(),
      isPlaying:false
    });
    logger.info('[METHODS][INSERT]['+type+']',pl);
    Kouch.update({'_id':kkId._id},{'$push':{ 'playlist':pl}});    
    return pl      
  };
}

exports.playIt = function(playlistId){
  if (typeof cplayer == "undefined") {
    // mplayer is not started
    logger.info('[METHODS][PLAYIT][URL]',playlistId)
    player(playlistId); 
    playerState.stop == false
  } else {

    if (playerState.skip == true) {
      playerState.skip = false
      playerState.queue = true
    }

    if (playerState.stop == true && typeof playlistId == "undefined" ) {
      logger.info('[METHODS][PLAYIT] next QUEUE');
      playerState.stop == false 
      NextQueue();
    }else{
      logger.info('[METHODS] Start mplayer ')
      player(playlistId); 
    }
  
  }
}

exports.queueMode = function(){
    playerState.queue = !playerState.queue;
    logger.info('[METHODS][QUEUE][MODE] ' + playerState.queue ? "ON" : "OFF");
}

exports.delPlaylistEntry = function(id){
  logger.info('[METHODS][DEL][ENTRY] ',id);
  check(id, String)
  var kk = Kouch.findOne({})
  var pos = kk.playlist.indexOf(id)
  kk.playlist.splice(pos,1)
  Kouch.update({'_id':kk._id},{ $set :{'playlist':kk.playlist}});
}

exports.startStream = function(){
  logger.info('[METHODS]Start Stream: ');
  cp.exec('livestreamer twitch.tv/nl_kripp 480p --player mplayer',function (error, stdout, stderr,stdin) {
    // parameter bug
    // -f choise prefeard video format http://en.wikipedia.org/wiki/YouTube#Quality_and_codecs
   if (error) {
     logger.info(error.stack);
     logger.info('Error code: '+error.code);
     logger.info('Signal received: '+error.signal);
   }
   if (stdout) {
      logger.info(stdout);
      player(stdout);
      cplayer.stdin.write('\nf');
   };
  });
}

exports.getList = function(){
  // return the playlist with only queue elements
  var queue = Kouch.findOne({});//have only the playlist ids not the full entry --> This cann be found under playlist collection .... bad name i now 
  if (typeof queue != "undefined") {
    if (typeof queue.playlist != 'undefined') {
      var pl =  Playlist.find({
       '_id': { $in : queue.playlist }
      }).fetch();
      return pl 
    }       
  }
}

exports.setState = function(state){
  kk = Kouch.findOne({})
  Kouch.update({'_id':kk._id},{ $set :{'state':state}});
}

exports.analyse = function(api,sourceUrl){
  result = [] 
  var videoCodices = '-f 34/35/43/45/84/102/141/135/136/'

  if (typeof sourceUrl !== undefined ) {
    logger.info('[METHODS] ',api,sourceUrl);

    if(api == 'youtube'){
      Meteor.call('setState','add to playlist ...'+ sourceUrl.title); // frontent notification
      var options = ['-g'];
      options.push(sourceUrl.url.toString().trim());
      var parse = cp.spawn('youtube-dl',[options[0], videoCodices, options[1]]);
    }

    if(api == 'api'){
      Meteor.call('setState','add to playlist ...'+ sourceUrl); // frontent notification
      var options = ['-ge','--get-thumbnail'];
      options.push(sourceUrl.toString().trim());
      var parse = cp.spawn('youtube-dl',[options[0],options[1], videoCodices, options[2]]);
    }
  
    getParseData(parse,api);
    getParseDataError(parse);
    getParseResults(parse,api,sourceUrl,result)
  }
}
