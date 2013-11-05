"use strict";

var cp = require('child_process')
  , async = require('async');


var getParseData = exports.getParseData = function (api, data){  
  var result = '';
  if (api === 'youtube') {
    return data.toString();
  }
};

var getParseDataError = exports.getParseDataError = function (error){
  console.error('stderr: ' + error);
};  


var analyseLink = exports.analyseLink = function(api, sourceUrl, cb){
  var result = []
    , videoCodices = '-f 34/35/43/45/84/102/141/135/136/'
    , parse;

  if (typeof sourceUrl !== undefined ) {
      console.info('[METHODS] ', api, sourceUrl);

    if (api === 'youtube') {
      sourceUrl = sourceUrl.trim();
      parse = cp.spawn('youtube-dl',['-g', videoCodices, sourceUrl]);

      parse.stdout.on('data', function (data) {
        var parseData = getParseData(api, data.toString());

        console.log('parseData = ', parseData);
        if (typeof cb === 'function') { 

          //parse.removeAllListeners();
          cb(null, parseData); 
        }
      });

      parse.stderr.on('data', function (error) {
        getParseDataError(error);
      });
    }
  }
}

var findLinks = exports.findLinks = function (media, callback) {
  async.map(media, function (file, cb) {
    analyseLink(file.hoster, file.originalUrl, function (err, link) {
      file.url = link.replace('\n', '');

      //~ console.log('setting media file youtube direct video url to: ' + link);
      cb(err, file);
    });
  },
  function(err, mediaFiles) {
    console.log('returning data, mediaFiles = ', mediaFiles + ' typeof mediaFiles = ' + typeof mediaFiles);
    if (typeof callback === 'function') { callback(err, mediaFiles); }
  });
}
