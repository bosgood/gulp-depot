var gulp = require('gulp'),
  nconf = require('nconf'),
  depot = require('../')
;

gulp.task('deploy', function() {
  nconf.argv().env().file('config-dev.json');
  return gulp.src('index.html')
    .pipe(depot({
      applicationName: nconf.get('applicationName'),
      secret: nconf.get('secret'),
      address: nconf.get('address'),
      setLatest: nconf.get('setLatest')
    }))
    .on('error', function(err) {
      console.error('error', err);
    })
    .on('data', function(data) {
      console.log('data', data);
    });
  ;
});

gulp.task('default', ['deploy']);
