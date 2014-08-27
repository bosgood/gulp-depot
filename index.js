var through = require('through2');
var http    = require('http');
var gutil   = require('gulp-util');

function uniqueId() {
  return 'xxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  });
}

// Gets a unique version number
// 2014-08-16--a4d4bd9f
function createVersionNumber() {
  return new Date().toJSON().slice(0, 10) + '--' + uniqueId();
}

// Creates an application version in depot with the file contents
function createVersion(contents, opts, done) {
  "use strict";

  var version = opts.version || createVersionNumber();
  var path = '/apps/' + opts.applicationName + '/versions/' + version;
  if (opts.secret) {
    var secretParamName = opts.secretParamName || 'secret';
    path += '?' + secretParamName + '=' + opts.secret;
  }

  var httpOptions = {
    host: opts.address,
    // /apps/:appId/versions/:versionId
    path: path,
    method: 'POST',
    port: opts.port || 80
  };

  var jsonPostBody = JSON.stringify({
    contents: contents
  });

  var req = http.request(httpOptions, function(res) {
    res.setEncoding('utf-8');

    var responseString = '';

    res.on('data', function(data) {
      responseString += data;
    });

    res.on('end', function() {
      console.log("response:");
      console.log(resultObject);
      var resultObject = JSON.parse(responseString);
      done();
    });
  });

  req.write(jsonPostBody);
  req.end();
}

module.exports = function(opts) {
  "use strict";

  if (!opts) {
    throw new gutil.PluginError('gulp-depot', 'Must specify an `options` parameter.');
  }

  // see "Writing a plugin"
  // https://github.com/gulpjs/gulp/blob/master/docs/writing-a-plugin/README.md
  function depot(file, enc, callback) {
    /*jshint validthis:true*/

    // Do nothing if no contents
    if (file.isNull()) {
      this.push(file);
      this.emit(
        'error',
        new gutil.PluginError('gulp-depot', 'Must provide file contents to deploy')
      )
      return callback();
    }

    if (file.isStream()) {
      // http://nodejs.org/api/stream.html
      // http://nodejs.org/api/child_process.html
      // https://github.com/dominictarr/event-stream
      this.emit(
        'error',
        new gutil.PluginError('gulp-depot', 'Stream content is not supported')
      );
      return callback();
    }

    if (file.isBuffer()) {
      // http://nodejs.org/api/buffer.html
      createVersion(file.contents.toString(), opts, callback);
      this.push(file);
    }
  }

  return through.obj(depot);
};
