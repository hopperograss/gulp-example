//include gulp
var gulp      = require('gulp'),
    jshint    = require('gulp-jshint'),
    less      = require('gulp-less'),
    concat    = require('gulp-concat'),
    uglify    = require('gulp-uglify'),
    rename    = require('gulp-rename'),
    clean     = require('gulp-clean'),
    webserver = require('gulp-webserver');

var paths = {
    source: {
        root: 'source/',
        js: 'source/js/**/*.js',
        less: 'source/less/*.less',
        css: 'source/css/**',
        copy: 'source/copy/**',
        views: 'source/views/**',
        lib: 'source/lib/**'
    },
    dist: {
        root: 'www/',
        js: 'www/js',
        css: 'www/css',
        cssLib: 'www/cssLib',
        lib: 'www/js/lib',
        csslib: 'www/css/lib',
        partials: 'www/js/partials/**.html'
    }
};

// =========== GENERAL =============

//CSS - compile less
gulp.task('css.dev',function(){
    gulp.src('source/less/*.less')
        .pipe(less())
        .pipe(gulp.dest('www/css'));
});

//clean task
gulp.task('clean',function(){
    return gulp.src(paths.dist.root, {read: false})
        .pipe(clean());
});

//lint task
gulp.task('lint',function(){
    return gulp.src(paths.source.js)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

//Copy files
gulp.task('copy',function(){
    gulp.src([
        paths.source.copy,
        paths.source.root+'copy/.htaccess',
        '!.DS_Store',
        '!.thumbs',
        '!Thumbs.db',
        '!.db'
    ])
        .pipe(gulp.dest(paths.dist.root));

    gulp.src(paths.source.views)
        .pipe(gulp.dest(paths.dist.root));

    gulp.src(paths.source.lib)
        .pipe(gulp.dest(paths.dist.lib));

    gulp.src(paths.source.css)
        .pipe(gulp.dest(paths.dist.css));
});
// =========== DEVELOPMENT =============

//JS Dev - minify, copy lib
gulp.task('js.dev',function(){
    gulp.src(paths.source.js)
        .pipe(uglify())
        .pipe(gulp.dest(paths.dist.js));
});

//WEB SERVER
gulp.task('webserver', function() {
    gulp.src('www/')
        .pipe(webserver({
            host: '0.0.0.0',
            livereload: false,
            directoryListing: false,
            open: false,
            fallback: 'index.html'
        }));
});

// =========== PRODUCTION =============


// =========== WATCHERS & TASKS =============

//Watch files for changes
gulp.task('watch',function(){
    gulp.watch(paths.source.js,['lint','js.dev']);
    gulp.watch(paths.source.less,['css.dev']);
    gulp.watch([paths.source.copy,paths.source.views,paths.source.lib,paths.source.css],['copy']);
});

//Default task
gulp.task('default',['lint','css.dev','js.dev','copy','watch','webserver']);
gulp.task('production',['lint','css.dev','copy','js.prod','css.prod']);