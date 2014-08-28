# gulp-depot
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url]  [![Coverage Status][coveralls-image]][coveralls-url] [![Dependency Status][depstat-image]][depstat-url]

> [depot](https://github.com/bosgood/depot) deploying plugin for [gulp](https://github.com/wearefractal/gulp)

## Usage

First, install `gulp-depot` as a development dependency:

```shell
npm install --save-dev gulp-depot
```

Then, add it to your `gulpfile.js`:

```javascript
var gulp  = require('gulp');
var depot = require('gulp-depot');

var opts = {
  applicationName: 'your-app-name',
  secret: 'PaSsW0rD',
  address: '127.0.0.1',
  setLatest: true
};

gulp.src('index.html')
  .pipe(depot(opts))
  .on('error', function(err) {
    console.error('error', err);
  })
  .on('data', function(data) {
    console.log('data', data);
  });
```

## API

### depot(options)

### Content

The contents passed to the plugin must be the contents of your `index.html` file.

#### options.address
Type: `String`

The address of the depot server.

#### options.applicationName
Type: `String`

The depot application name that you're deploying.

#### options.setLatest
Type: `Boolean`

*(optional)* Pass `true` to set this deploy as the `latest`.

#### options.secret
Type: `String`
Default: `null`

*(optional)* Authentication shared secret, if present.

#### opts.secretParamName
Type: `String`
Default: `"secret"`

*(optional)* URL parameter name for the shared secret.

#### options.version
Type: `String`
Default: (auto-generated)

*(optional)* Specify a version name manually.

#### options.port
Type: `Number`
Default: 80

*(optional)* Specify the server port.

#### options.path
Type: `String`
Default: null

*(optional)* Specify an additional path at which the server responds, e.g., `/depot` for `http://example.com/depot`.

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)

[npm-url]: https://npmjs.org/package/gulp-depot
[npm-image]: https://badge.fury.io/js/gulp-depot.png

[travis-url]: http://travis-ci.org/bosgood/gulp-depot
[travis-image]: https://secure.travis-ci.org/bosgood/gulp-depot.png?branch=master

[coveralls-url]: https://coveralls.io/r/bosgood/gulp-depot
[coveralls-image]: https://coveralls.io/repos/bosgood/gulp-depot/badge.png

[depstat-url]: https://david-dm.org/bosgood/gulp-depot
[depstat-image]: https://david-dm.org/bosgood/gulp-depot.png
