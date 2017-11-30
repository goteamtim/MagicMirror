var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;
var nodemon = require('gulp-nodemon');
var clean = require('gulp-clean');
var uglify = require('gulp-uglify');
var pump = require('pump');

// Default task - stage build
gulp.task('default', ['browsersync-dev', 'watch-dev']);

gulp.task('watch-dev', function () {

  gulp.watch(['**.**', 'js/*','css/*'], reload);

});

// Static dev server
gulp.task('browsersync-dev', ['nodemon-dev'], function () {
  browserSync.init({
    proxy: "localhost:3000",  // local node app address
    port: 5000,  // use *different* port than above
    notify: true
  });

  //gulp.watch("*.*").on('change',function(){console.log("gulp watched")});  //reload
});

gulp.task('nodemon-dev', function (cb) {
  var called = false;
  return nodemon({
    script: 'index.js',
    ignore: [
      'gulpfile.js',
      'node_modules/'
    ]
  })
    .on('start', function () {
      if (!called) {
        called = true;
        cb();
      }
    })
    .on('restart', function () {
      setTimeout(function () {
        reload({ stream: false });
      }, 1000);
    });
});

//prod build for testing
gulp.task('test prod', ['build','browsersync-prod', 'watch-prod']);

gulp.task('watch-prod', function () {

  gulp.watch(['**.**', 'js/*','css/*'], reload);

});

// Static dev server - prod build
gulp.task('browsersync-prod', ['nodemon-prod'], function () {
  browserSync.init({
    proxy: "localhost:3000",  // local node app address
    port: 5000,  // use *different* port than above
    notify: true
  });

  //gulp.watch("*.*").on('change',function(){console.log("gulp watched")});  //reload
});

gulp.task('nodemon-prod', function (cb) {
  var called = false;
  return nodemon({
    script: 'index.js',
    ignore: [
      'gulpfile.js',
      'node_modules/'
    ]
  })
    .on('start', function () {
      if (!called) {
        called = true;
        cb();
      }
    })
    .on('restart', function () {
      setTimeout(function () {
        reload({ stream: false });
      }, 1000);
    });
});

//Build Prod
gulp.task( 'build', ['compress'], function() {
  console.log("Prod build complete.")
});

gulp.task('compress', function () {
  pump([
        gulp.src('js/*.js'),
        uglify(),
        gulp.dest('dist/js')
    ],
    console.log("Compress complete...")
  );
});

//test prod