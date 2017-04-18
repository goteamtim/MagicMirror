var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
var reload      = browserSync.reload;
var nodemon     = require('gulp-nodemon')

// Static server
gulp.task('browsersync',['nodemon'], function() {
    browserSync.init({
        proxy: "localhost:3000",  // local node app address
    port: 5000,  // use *different* port than above
    notify: true
    });
    
    //gulp.watch("*.*").on('change',function(){console.log("gulp watched")});  //reload
});

gulp.task('nodemon', function (cb) {
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

// Default task
gulp.task('default',['browsersync','watch']);

gulp.task('watch', function() {

    gulp.watch(['**.**','./**/*.*'], reload);

});

gulp.task('deploy', function(){


});