"use strict";

/*****************
 * autoloads all databases needed from files on first call
 * afterwards just returns them.
*/

var path = require('path')
  , Datastore = require('nedb')
  , dbs = false;

function sort(property) {
  /****
   * first check if we should sort by -1 or 1
   */ 
  var sortOrder = 1;
  if(property[0] === "-") {
      sortOrder = -1;
      property = property.substr(1);
  }
  //now actually compare:
  return function (a,b) {
      var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
      return result * sortOrder;
  }
}

function sortMultiple() {
  /****
   * save the arguments object as it will be overwritten
   * note that arguments object is an array-like object
   * consisting of the names of the properties to sort by
   */
  var props = arguments;
  return function (obj1, obj2) {
      var i = 0, result = 0, numberOfProperties = props.length;
      /****
       * try getting a different result from 0 (equal)
       * as long as we have extra properties to compare
       */
      while(result === 0 && i < numberOfProperties) {
          result = sort(props[i])(obj1, obj2);
          i++;
      }
      return result;
  }
}



module.exports = function loadDB() {

  //dbs is dbs if dbs is truethy else dbs is default object and databases get loaded from disk
  dbs = dbs || {
      session: new Datastore({filename: path.join(__dirname, 'session.db'), autoload: true })
    , history: new Datastore({filename: path.join(__dirname, 'history.db'), autoload: true })
    , playlist: new Datastore({filename: path.join(__dirname, 'playlist.db'), autoload: true })
    , media: new Datastore({filename: path.join(__dirname, 'media.db'), autoload: true })
    //~ , user: new Datastore({filename: path.join(__dirname, 'user.db'), autoload: true })
  };

  dbs.utils = {
    sort: function sort(list, argls) {
      if (typeof list !== 'array') { console.log('argument 1 must be an array of items to sort'); }
      if (typeof argls !== 'array') { console.log('argument 2 must be an array of criteria to sort with: ["name", "-date"]'); }
      return list.sort(sortMultiple.apply(null, argls));
    }
  }

  return dbs;
}();

