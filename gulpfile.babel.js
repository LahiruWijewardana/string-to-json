const gulp = require('gulp');
const path = require('path');
const del = require('del');
const runSequence = require('run-sequence');

const eslint = require('gulp-eslint');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const nodemon = require('gulp-nodemon');

const paths = {
  js: ['./**/*.js', '!dist/**', '!node_modules/**', '!coverage/**'],
  nonJs: ['./package.json', './.gitignore', './ecosystem.config.js'],
  tests: './server/tests/*.js'
};

// Clean up dist and coverage directory
gulp.task('clean', () =>
  del(['dist/**', 'coverage/**', '!dist', '!coverage']));

// Lint Javascript
gulp.task('lint', () =>
  gulp.src(paths.js)
    // eslint() attaches the lint output to the "eslint" property
    // of the file object so it can be used by other modules.
    .pipe(eslint())
    // eslint.format() outputs the lint results to the console.
    // Alternatively use eslint.formatEach() (see Docs).
    .pipe(eslint.format())
    // To have the process exit with an error code (1) on
    // lint error, return the stream and pipe to failAfterError last.
    .pipe(eslint.failAfterError()));

// Copy non-js files to dist
gulp.task('copy', () =>
  gulp.src(paths.nonJs)
    .pipe(gulp.dest('dist')));

// Compile ES6 to ES5 and copy to dist
gulp.task('babel', () =>
  gulp.src([...paths.js, '!gulpfile.babel.js'], { base: '.' })
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(sourcemaps.write('.', {
      includeContent: false,
      sourceRoot(file) {
        return path.relative(file.path, __dirname);
      }
    }))
    .pipe(gulp.dest('dist')));

// Start server with restart on file changes
gulp.task('nodemon', ['lint', 'copy', 'babel'], () =>
  nodemon({
    script: path.join('dist', 'index.js'),
    ext: 'js',
    ignore: ['node_modules/**/*.js', 'dist/**/*.js'],
    tasks: ['lint', 'copy', 'babel']
  }));

// clean dist, compile js files, copy non-js files and execute tests
gulp.task('mocha', ['clean'], () => {
  runSequence(
    ['copy', 'babel'],
    'test'
  );
});

// gulp serve for development
gulp.task('serve', ['clean'], () => runSequence('nodemon'));

// default task: clean dist, compile js files and copy non-js files.
gulp.task('default', ['clean'], () => {
  runSequence(['copy', 'babel']);
});
