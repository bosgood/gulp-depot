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
var depot = require('gulp-depot');

gulp.src('index.html')
	.pipe(depot({
		applicationName: 'my-app',
		setLatest: true,
		secret: 'PaSsW0rD'
	}))
	.on('error', function(err) {
		...
	})
	.on('success', function() {
		...
	});
```

## API

### depot(options)

### Content

The contents passed to the plugin must be the contents of your `index.html` file.

#### options.applicationName
Type: `String`

The depot application name that you're deploying.

#### options.setLatest
Type: `Boolean`

*(optional)* Pass `true` to set this deploy as the `latest`.

#### options.secret
Type: `String`

*(optional)* Authentication shared secret, if present.

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
