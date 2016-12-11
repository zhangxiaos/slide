var gulp   = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

gulp.task('scripts', function() {
  gulp.src('./src/slide.js')
    .pipe(rename('slide.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./'));
});