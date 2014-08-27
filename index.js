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

function getHTTPOptions(body, opts) {
  return {
    host: opts.address,
    method: 'POST',
    port: opts.port || 80,
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': body.length
    }
  }
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

  var postBody = JSON.stringify({
    contents: contents
  });

  var httpOptions = getHTTPOptions(postBody, opts);
  httpOptions.path = path;

  var req = http.request(httpOptions, function(res) {
    var responseString = '';

    res.setEncoding('utf-8');
    res.on('data', function(data) {
      responseString += data;
    });
    res.on('end', function() {
      var resultObject;
      var error;
      try {
        resultObject = JSON.parse(responseString);
      } catch(e) {
        error = e;
      }

      if (!error && req.statusCode >= 300) {
        error = {
          error: resultObject,
          message: 'failed to create new version',
          statusCode: req.statusCode
        };
      }

      if (error) {
        done(error, null);
        return;
      }

      // Request succeeded. If `setLatest` isn't set, all done
      if (!opts.setLatest) {
        done(error, resultObject);
        return;
      }

      // Otherwise promote the version as latest
      setLatest(version, opts, done);
    });
  });

  req.write(postBody);
  req.end();
}

// Promotes the deployed version to the `latest`
function setLatest(version, opts, done) {

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

    var _this = this;

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
      createVersion(file.contents.toString(), opts, function(err, data) {
        if (err) {
          _this.emit(
            'error',
            new gutil.PluginError('gulp-depot', err)
          )
          callback();
          return;
        }

        if (data) {
          _this.emit('data', data);
        }
        callback();
      });

      this.push(file);
    }
  }

  return through.obj(depot);
};
