analyse : function(api, sourceUrl) {
  result = [];

  var videoCodexs = '-f 34/35/43/45/84/102/141/135/136/'

  if (typeof sourceUrl !== undefined ) {
      logger.info('[METHODS] ',api, sourceUrl);

    if(api == 'youtube'){
      Meteor.call('setState','add to playlist ...'+ sourceUrl.title); // frontent notification
      var options = ['-g'];
      options.push(sourceUrl.url.toString().trim());
      var parse = cp.spawn('youtube-dl',[options[0], videoCodexs, options[1]]);
    }

    if(api == 'api'){
      Meteor.call('setState','add to playlist ...'+ sourceUrl); // frontent notification
      var options = ['-ge','--get-thumbnail'];
      options.push(sourceUrl.toString().trim());
      var parse = cp.spawn('youtube-dl',[options[0],options[1],videoCodexs,options[2]]);
    }
    getParseData(parse,api);
    getParseDataError(parse);
    getParseResults(parse,api,sourceUrl,result)
  }
}
