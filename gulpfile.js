// Defining base paths
var basePaths = {
    js: './js/',
    css: './css/',
    node: './node_modules/',
    dev: './src/'
};

var gulp = require('gulp');
var sass = require('gulp-sass');
var watch = require('gulp-watch');
var del = require('del');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var cssmin = require('gulp-cssmin');
var htmlreplace = require('gulp-html-replace');
var rename = require("gulp-rename");
var sourcemaps = require('gulp-sourcemaps');
var plumber = require('gulp-plumber');
var browserSync = require('browser-sync').create();

gulp.task('sass', function () {
    return gulp.src('app/scss/*.scss')
        .pipe(plumber({
            errorHandler: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(sass())
        .pipe(sourcemaps.write(undefined, { sourceRoot: null }))
        .pipe(gulp.dest('./app/css'))
        .pipe(browserSync.reload({
            stream: true
        }));
});


gulp.task('watch', ['browserSync', 'sass'], function () {
    gulp.watch('app/scss/**/*.scss', ['sass']);
    gulp.watch('app/*.html', browserSync.reload);
    gulp.watch('app/js/app.js',['scripts']);
});

gulp.task('browserSync', function () {
    browserSync.init({
        server: {
            notify: false,
            browser: "chrome",
            baseDir: 'app'
        },
    })
});

gulp.task('css-min', function () {
    gulp.src('app/css/styles.css')
        .pipe(cssmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./app/css/'));
});

// Uglifies and concat all JS files into one
gulp.task('scripts', function() {
    var scripts = [

        // Start - All BS4 stuff

        basePaths.dev + 'js/bootstrap4/bootstrap.bundle.min.js',

        'app/js/app.js',
    ];
    gulp.src(scripts)
        .pipe(concat('theme.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./app/js/'));

    gulp.src(scripts)
        .pipe(concat('theme.js'))
        .pipe(gulp.dest('./app/js/'))
        .pipe(browserSync.reload({
            stream: true
        }));
});


gulp.task('clean-source', function () {
    return del(['src/**/*',]);
});

////////////////// All SASS  Assets /////////////////////////
gulp.task('copy-assets', ['clean-source'], function () {

// Copy all Bootstrap JS files
    var stream = gulp.src(basePaths.node + 'bootstrap/dist/js/**/*.js')
        .pipe(gulp.dest(basePaths.dev + '/js/bootstrap4'));

// Copy all Bootstrap SCSS files
    gulp.src(basePaths.node + 'bootstrap/scss/**/*.scss')
        .pipe(gulp.dest(basePaths.dev + '/sass/bootstrap4'));

    return stream;
});

gulp.task('replace-html', function() {
    gulp.src('./app/index.html')
        .pipe(htmlreplace({
            'css': 'css/styles.min.css',
            'js': 'js/theme.min.js'
        }))
        .pipe(gulp.dest('./dist/app/'));
});

// gulp dist
// Copies the files to the /dist folder for distribution as simple theme
gulp.task('dist', ['clean-dist', 'css-min'], function () {
    gulp.src(['**/*', '!app/scss','!app/js/app.js','!app/css/styles.css', '!app/scss/**','!app/index.html', '!bower_components', '!bower_components/**', '!node_modules', '!node_modules/**', '!src', '!src/**', '!dist', '!dist/**', '!dist-product', '!dist-product/**', '!sass', '!sass/**', '!readme.txt', '!readme.md', '!package.json', '!gulpfile.js', '!CHANGELOG.md', '!.travis.yml', '!jshintignore', '!codesniffer.ruleset.xml', '*'])
        .pipe(gulp.dest('dist/'));
    gulp.src('./app/index.html')
        .pipe(htmlreplace({
            'css': 'css/styles.min.css',
            'js': 'js/theme.min.js'
        }))
        .pipe(gulp.dest('./dist/app/'));
});

// Deleting any file inside the /src folder
gulp.task('clean-dist', function () {
    return del(['dist/**/*',]);
});