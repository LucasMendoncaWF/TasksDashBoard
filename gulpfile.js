var gulp = require('gulp'),
  sass = require('gulp-sass'),
  cssnano = require('gulp-csso'),
  ts = require('gulp-typescript'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename');


// Styles
gulp.task('styles', function () {
  return gulp.src('styles/sass/*.scss')
    .pipe(sass({ style: 'expanded' }))
    .pipe(gulp.dest('styles/css'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(cssnano())
    .pipe(gulp.dest('styles/min.css'));
});

gulp.task('ts', function () {
  return gulp.src('scripts/ts/**/*.ts')
    .pipe(ts({
      target: 'es5'
    }))
    .pipe(gulp.dest('scripts/js'));
});


// Scripts
gulp.task('js', ['ts'], function () {
  return gulp.src('scripts/js/**/*.js')
    .pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(gulp.dest('scripts/min.js'));
});

gulp.task('default',['styles', 'js'], function () {
  gulp.start('styles', 'js');
});
