const gulp = require('gulp');
const del = require('del');
const browserSync = require('browser-sync');
const gulpLoadPlugins = require('gulp-load-plugins');
const browserify = require("browserify");
const babelify = require("babelify");
const cmq = require('gulp-combine-media-queries');
const source = require('vinyl-source-stream')
const buffer = require('vinyl-buffer')

const $ = gulpLoadPlugins();
const reload = browserSync.reload;

// break build if BrowserSync is not active
function onError(err){
  console.log(err.message);

  $.notify.onError({
    title: "Compile Error",
    message: "<%= error.message %>"
  }).apply(this, Array.prototype.slice.call(arguments));

  if (browserSync.active) {
    this.emit('end');
  }
};

gulp.task('clean', () => del([ 'build' ], { dot: true }));

/*
gulp.task('images', () => {
  return gulp.src('app/img/** /*')
    .pipe($.cache($.imagemin({
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest('build/img'))
    .pipe($.size({title: 'images'}));
});
*/

gulp.task('styles', () => {

  return gulp.src([ 'scss/main.scss' ])
    .pipe($.sourcemaps.init())
    .pipe($.sass({
      precision: 10
    }).on('error', $.sass.logError))
    .pipe($.autoprefixer([
      'ie >= 8',
      'ie_mob >= 10',
      'ff >= 30',
      'chrome >= 34',
      'safari >= 7',
      'ios >= 7',
      'android >= 4.4'
    ]))
    .pipe($.combineMediaQueries())
    .pipe($.minifyCss())
    .pipe($.sourcemaps.write('.'))
    .pipe($.rename('styles.css'))
    .pipe(gulp.dest('build'))
    .pipe($.size({title: 'styles'}));
});

gulp.task('polyfill', () => {
  return browserify({
        entries: ['lib/polyfill.js'],
        paths: [ 'lib' ],
        debug : false // !gulp.env.production
      })
      .transform([ babelify ])
      .bundle()
      .pipe(source('koliseo-polyfill.js'))
      .pipe(buffer())
      .pipe($.uglify())
      .pipe(gulp.dest('.'))
});

gulp.task('scripts', () => {
  return browserify({
        entries: ['lib/main.js'],
        paths: [ 'lib' ],
        debug : true // !gulp.env.production
      })
      .transform([ babelify ])
      .bundle()

      .on('error', onError)
      .pipe(source('koliseo-agenda.js'))
      .pipe(buffer())
      .pipe($.sourcemaps.init({
        loadMaps: true,
        base: '.'
        //sourceRoot: '..'
      })) // loads map from browserify file
      //.pipe($.uglify())
      .pipe($.sourcemaps.write('.')) // writes .map file
      .pipe(gulp.dest('build/'))
});

/*
gulp.task('test', () => {
  return gulp.src('src/test/js/q-*.html')
    .pipe($.qunit());
});
*/

// Watch Files For Changes & Reload
gulp.task('serve', ['styles', 'polyfill', 'scripts'], () => {
  browserSync({
    notify: false,
    // https: true,
    server: [ '.' ],
    directory: true
  });

  gulp.watch(['test/*.html'], [ reload ]);
  gulp.watch(['scss/**/*.scss'], [ 'styles', reload ]);
  gulp.watch(['lib/**'], [ 'scripts', reload ]);
  gulp.watch(['img/**/*'], [ 'images', reload ]);
});

gulp.task('default', ['clean', 'styles', 'polyfill', 'scripts']);
