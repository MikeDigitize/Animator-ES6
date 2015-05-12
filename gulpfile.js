var gulp = require('gulp');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var minifyCSS = require('gulp-minify-css');
var babel = require("gulp-babel");
var babelify = require('babelify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var clean = require('gulp-clean');

var buildPath = './build';
var compiledPath = './js/compiled';
var es6JS = './js/animator/*.js';
var _sass = './styles/*.scss';
var html = './*.html';
var promises = './js/es6-promise.js';

gulp.task("html", function () {
    return gulp.src(html)
        .pipe(gulp.dest(buildPath));
});

gulp.task('styles', function () {
    return gulp.src(_sass)
        .pipe(concat('demo-styles.scss'))
        .pipe(sass())
        .pipe(rename('styles.css'))
        .pipe(minifyCSS({keepBreaks:false}))
        .pipe(gulp.dest(buildPath + '/css'));
});

gulp.task('es6', function () {
    return gulp.src([es6JS])
        .pipe(babel())
        .pipe(gulp.dest(compiledPath));    
});

gulp.task('compileJS', ['es6'], function() {
    return browserify({
        entries: compiledPath + '/test.js',
        debug: true
    })
    .transform(babelify)
    .bundle()
    .pipe(source('main.js'))
    .pipe(gulp.dest(compiledPath));
});

gulp.task('animator', ['compileJS'], function() {
    return gulp.src([promises, compiledPath + '/main.js'])
        .pipe(concat('animator.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(buildPath + '/js'));
});

gulp.task('cleanup', ['animator'], function() {
    return gulp.src(compiledPath)
        .pipe(clean());
});

gulp.task('watch', function () {
    gulp.watch(_sass, ['styles']);
    gulp.watch(es6JS, ['es6', 'compileJS', 'animator', 'cleanup']);
    gulp.watch(html, ['html']);
});

gulp.task('default', ['html', 'styles', 'es6', 'compileJS', 'animator', 'cleanup', 'watch']);