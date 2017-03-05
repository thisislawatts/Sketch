/**
 * @package sketch
 * @author Willem Dumee
 * @version 0.2
 */

var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var connect = require('gulp-connect-php');
var cached = require('gulp-cached');
var sass = require('gulp-sass');
var minify = require('gulp-minify');
var flatten = require('gulp-flatten');
var sourcemaps = require('gulp-sourcemaps');
var rename = require('gulp-rename');
var csslint = require('gulp-csslint');
var jshint = require('gulp-jshint');
var url = require('url');
var newer = require('gulp-newer');
var lightspeedy = require('./libs/lightspeedy');

var Config = require('./sketch.config.json');

const Paths = {
    source: './src',
    output: './theme',
    sourceAsset: './src/assets'
};

gulp.task('lq',() => {
    gulp.watch( Paths.source + '/**/*.rain', ['upload', 'cp']);
})

gulp.task('upload', () => {
    return gulp.src([
            Paths.source + '/**/*.rain'
        ])
        .pipe(newer(Paths.output))
        .pipe(lightspeedy({
            storeUrl: Config.lightspeedUrl,
            themeId: Config.themeId,
            email: Config.emailAddress,
            password: Config.password
        }))
        .pipe(gulp.dest(Paths.output));
});

gulp.task('cp', () => {
    return gulp.src([
            Paths.source + '/**/*.rain'
        ])
        .pipe(newer(Paths.output))
        .pipe(gulp.dest(Paths.output));
})

gulp.task('php', function() {
    var localUrl = url.parse(Config.localUrl);

    connect.server({
        hostname: localUrl.hostname,
        port: localUrl.port
    }, () => {
        browserSync.init({
            proxy: Config.localUrl,
            port: 3001
        });
   });
})

gulp.task('watch', function () {
    gulp.watch(Paths.sourceAsset + '/scss/**/*.scss', ['sass']);
    gulp.watch(Paths.sourceAsset + '/javascript/**/*.js', ['scripts']);
    gulp.watch(Paths.source + '/**/*.rain').on('change', browserSync.reload);
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function () {
    return gulp.src(Paths.sourceAsset + '/scss/**/*.scss')
        .pipe(flatten())
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('assets'))
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(rename({
            suffix: '-min'
        }))
        .pipe(gulp.dest( Paths.output + '/assets'))
        .pipe(browserSync.stream());
});

gulp.task('css', function () {
    gulp.src([ Paths.output + '/assets/*.css', '!' + Paths.output + '/assets/bootstrap-min.css'])
        .pipe(csslint())
        .pipe(csslint.reporter());
});

gulp.task('scripts', function () {
    gulp.src(Paths.sourceAsset + '/javascript/**/*.js')
        .pipe(flatten())
        .pipe(minify())
        .pipe(gulp.dest( Paths.output + '/assets'))
        .pipe(browserSync.stream());
});

gulp.task('jshint', function () {
    gulp.src( Paths.sourceAsset + '/javascript/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('default', ['php', 'watch']);

gulp.task('sync', ['default', 'lq'])