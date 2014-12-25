'use strict'

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync');
var reload = browserSync.reload;

var AUTOPREFIXER_BROWSERS = [
  'ie >= 10',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
];

// Lint JavaScript
gulp.task('jshint', function() {
  return gulp.src('assets/scripts/**/*.js')
    .pipe(reload({
      once: true,
      stream: true
    }))
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.if(!browserSync.active, $.jshint.reporter('fail')));
});

// Optimize Images
gulp.task('images', function() {
  return gulp.src('assets/images/**/*')
    .pipe($.cache($.imagemin({
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest('wwwroot/images'))
    .pipe($.size({
      title: 'images'
    }));
});

// Compile and Automatically Prefix Stylesheets
gulp.task('styles', function() {
  // For best performance, don't add Sass partials to `gulp.src`
  return gulp.src([
      'assets/styles/*.scss',
      'assets/styles/**/*.css',
      'assets/styles/components/components.scss'
    ])
    .pipe($.changed('styles', {
      extension: '.scss'
    }))
    .pipe($.sass({
      precision: 10
    }))
    .on('error', console.error.bind(console))
    .pipe($.autoprefixer({
      browsers: AUTOPREFIXER_BROWSERS
    }))
    .pipe(gulp.dest('wwwroot/styles'))
    // Concatenate And Minify Styles
    .pipe($.if('*.css', $.csso()))
    .pipe(gulp.dest('wwwroot/styles'))
    .pipe($.size({
      title: 'styles'
    }));
});

gulp.task('serve', ['styles', 'images'], function() {
  browserSync({
    browser: ['google chrome'],
    logPrefix: 'vNext',
    notify: false,
    port: '4000',
    proxy: 'localhost:3000',
    startPath: 'index.html'
  });
  gulp.watch(['wwwroot/**/*.html'], reload);
  gulp.watch(['assets/styles/**/*.{scss,css}'], ['styles', reload]);
  gulp.watch(['wwwroot/scripts/**/*.js'], ['jshint']);
  gulp.watch(['assets/images/**/*'], ['images'], reload);
});

gulp.task('default', ['serve'], function(cb) {});