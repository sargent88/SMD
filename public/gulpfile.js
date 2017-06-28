const gulp = require('gulp'),
    sourcemaps = require('gulp-sourcemaps'),
    sass = require('gulp-sass'),
    CacheBuster = require('gulp-cachebust'),
    cachebust = new CacheBuster(),
    concat = require('gulp-concat'),
    babel = require('gulp-babel'),
    print = require('gulp-print'),
    uglify = require('gulp-uglify');

gulp.task('hello', function() {
    console.log('Hello from inside your computer.  abc We have gulp-off')
})

gulp.task('build-css', function() {
    return gulp.src('./styles/*')
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(cachebust.resources())
        .pipe(concat('styles.css'))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest('./dist'));
})

gulp.task('build-js', function() {
    return gulp.src(['./app.js', './configure.js', './js/**/*.js'])
        .pipe(sourcemaps.init())
        .pipe(print())
        .pipe(babel({ presets: ['es2015'] }))
        .pipe(concat('bundle.js'))
        //.pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('build', ['build-css', 'build-js'], function() {
    return gulp.src('index.html')
        .pipe(cachebust.references())
        .pipe(gulp.dest('dist'));
});

gulp.task('watch', function() {
    return gulp.watch(['./index.html', './views/*.html', './styles/*.*css', './js/**/*.js', './app.js'], ['build']);
});

gulp.task('default', ['watch', 'build-js', 'build-css'])