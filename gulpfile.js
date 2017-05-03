/* Gulp Packages */
var gulp = require('gulp'); // Gulp Itself
var jshint = require('gulp-jshint'); // JS Syntax Checking
var uglify = require('gulp-uglify'); // JS Minify
var minifyCSS = require('gulp-minify-css'); // CSS Minify
var autoprefixer = require('gulp-autoprefixer'); // CSS Autoprefixing
var gulpImports = require('gulp-imports'); // In-File Importing (Used for JS Concat)
var rename = require("gulp-rename"); // Rename Files (Used for JS '.min' prefixing)
var less = require('gulp-less'); // LESS Preprocessing
var lessGlobPlugin = require('less-plugin-glob'); // LESS Globs (file @import statements)
var browserSync = require('browser-sync').create(); // Browser Sync Webserver
var plumber = require('gulp-plumber'); // Error Handling
var cleanCSS = require('gulp-clean-css');

/* Default Task */
gulp.task('default', ['jshint', 'html', 'css', 'scripts', 'less', 'fonts', 'img', 'watch', 'webserver']);

/* JavaScript Checking */
gulp.task('jshint', function() {
  return gulp.src('js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'));
});

/* HTML File Processing */
gulp.task('html', function() {
  gulp.src('*.html') // Input
  .pipe(gulp.dest('dist/')) // Output
});

/* HTML File Processing */
gulp.task('css', function() {
  gulp.src('css/*.css') // Input
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(rename({
    suffix: ".min" // Add suffix to filename
    }))
    .pipe(gulp.dest('dist/css/')) // Output
});

/* JavaScript File Processing */
gulp.task('scripts', function() {
  gulp.src('js/*.js') // Input
  .pipe(plumber()) // Error Handling
  .pipe(gulpImports()) // Import JS includes
  .pipe(uglify()) // Minify JS
  .pipe(rename({
    suffix: ".min" // Add suffix to filename
  }))
  .pipe(gulp.dest('dist/js/')) // Output
  .pipe(browserSync.stream()); // Server Refresh
});


/* LESS File Processing */
gulp.task('less', function() {
  gulp.src('less/*.less') // Input
  .pipe(plumber()) // Error Handling
  .pipe(less({ // Run LESS with plugins
    plugins: [lessGlobPlugin] // LESS @import statements
  }))
  .pipe(autoprefixer({ // Run autoprefixers
      browsers: ['last 2 versions']
  }))
  .pipe(minifyCSS()) // Minify CSS
  .pipe(rename({
    suffix: ".min" // Add suffix to filename
  }))
  .pipe(gulp.dest('dist/css/')) // Output
  .pipe(browserSync.stream()); // Server Refresh
});

/* Copy Fonts To Dist */
gulp.task('fonts', function() {
  gulp.src('fonts/*') // Input
  .pipe(gulp.dest('dist/fonts/')) // Output
});

/* Copy IMG To Dist */
gulp.task('img', function() {
  gulp.src('img/*') // Input
  .pipe(gulp.dest('dist/img/')) // Output
});

/* Webserver using Browsersync */
gulp.task('webserver', function() {
  browserSync.init({
    server: {
      baseDir: "./dist/" // Serve Project Root
    },
    open: true // Automatic Browser Launch
  });
});

/* BrowserSync reload all Browsers */
gulp.task('browsersync-reload', function () {
    browserSync.reload();
});


/* Watch Tasks */
gulp.task('watch', function() {
  gulp.watch('js/*.js', ['jshint', 'scripts']); // Watch JavaScript
  gulp.watch('less/**/*.less', ['less']); // Watch LESS
  gulp.watch("*.html", ['browsersync-reload']); // Watch HTML
});

