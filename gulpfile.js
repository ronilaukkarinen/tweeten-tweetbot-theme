/*

REQUIRED STUFF
==============
*/

var changed     = require('gulp-changed');
var gulp        = require('gulp');
var sass        = require('gulp-sass');
var notify      = require('gulp-notify');
var prefix      = require('gulp-autoprefixer');
var minifycss   = require('gulp-clean-css');
var uglify      = require('gulp-uglify');
var cache       = require('gulp-cache');
var concat      = require('gulp-concat');
var util        = require('gulp-util');
var header      = require('gulp-header');
var pixrem      = require('gulp-pixrem');
var exec        = require('child_process').exec;

/*

FILE PATHS
==========
*/
var sassSrc = '*.{sass,scss}';
var sassFile = 'theme.scss';
var cssDest = './';

/*

ERROR HANDLING
==============
*/

var handleError = function(task) {
  return function(err) {
    notify.onError({
      message: task + ' failed, check the logs..'
    })(err);
    util.log(util.colors.bgRed(task + ' error:'), util.colors.red(err));
  };
};

/*

STYLES
======
*/

gulp.task('styles', function() {
  gulp.src(sassFile)
    .pipe(sass({
      compass: false,
      bundleExec: true,
      sourcemap: false,
      style: 'compressed',
      debugInfo: true,
      lineNumbers: true,
      errLogToConsole: true,
      includePaths: [
        'node_modules/',
        // 'bower_components/',
        // require('node-bourbon').includePaths
      ],
    }))

    .on('error', handleError('styles'))
    .pipe(prefix('last 3 version', 'safari 5', 'ie 9', 'opera 12.1', 'ios 6', 'android 4')) // Adds browser prefixes (eg. -webkit, -moz, etc.)
    .pipe(pixrem())
    .pipe(minifycss({
      advanced: true,
      keepBreaks: false,
      specialComments: 0,
      mediaMerging: true,
      sourceMap: true,
      debug: true
    }, function(details) {
        console.log('[clean-css] Original size: ' + details.stats.originalSize + ' bytes');
        console.log('[clean-css] Minified size: ' + details.stats.minifiedSize + ' bytes');
        console.log('[clean-css] Time spent on minification: ' + details.stats.timeSpent + ' ms');
        console.log('[clean-css] Compression efficiency: ' + details.stats.efficiency * 100 + ' %');
    }))
    .pipe(gulp.dest(cssDest))

});

/*
TASKS
=====
*/

gulp.task('watch', function() {
  gulp.watch(sassSrc, ['styles']);
});

gulp.task('default', function() {
  gulp.watch(sassSrc, ['styles']);
});
