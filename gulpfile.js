var gulp = require('gulp');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var minifyCSS = require('gulp-minify-css');
var wrap = require('gulp-wrap');
var babel = require("gulp-babel");
var babelify = require('babelify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var del = require('del');

var buildPath = './build';
var compiledPath = './js/temp';
var demo = './js/demo.js';
var shim = './js/browser-polyfill.min.js';
var js = './js/animator/*.js';
var styles = './styles/*.scss';
var html = './*.html';

gulp.task("html", function () {
    return gulp.src(html)
        .pipe(gulp.dest(buildPath));
});

gulp.task('styles', function () {
    return gulp.src(styles)
        .pipe(concat('demo-styles.scss'))
        .pipe(sass())
        .pipe(rename('styles.css'))
        .pipe(minifyCSS({keepBreaks:false}))
        .pipe(gulp.dest(buildPath + '/css'));
});

gulp.task('es6', function () {
    return gulp.src(js)
        .pipe(babel())
        .pipe(gulp.dest(compiledPath));    
});

gulp.task('compileJS', ['es6'], function() {
    return browserify({
        entries: compiledPath + '/animator.js',
        debug: true
    })
    .transform(babelify)
    .bundle()
    .pipe(source('temp.js'))
    .pipe(gulp.dest(compiledPath));
});

gulp.task('minify', ['compileJS'], function() {
    return gulp.src([shim, compiledPath + '/temp.js'])
        .pipe(concat('animator.min.js'))
        .pipe(uglify())
        .pipe(wrap("(function(){<%= contents %>})()"))
        .pipe(gulp.dest(buildPath + '/js'));
});

gulp.task('demo', function() {
    return gulp.src(demo)
        .pipe(gulp.dest(buildPath + '/js'))
});

gulp.task('watch', function () {
    gulp.watch(styles, ['styles']);
    gulp.watch(js, ['minify']);
    gulp.watch(demo, ['demo']);
    gulp.watch(html, ['html']);
});

gulp.task('default', ['html', 'styles', 'minify', 'demo', 'watch']);