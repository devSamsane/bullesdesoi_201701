/**
 * Created by SamS@ne on 01/11/2016.
 */
'use strict';

/**
 * Module dependencies
 */
var _ = require('lodash');
var fs = require('fs');
var defaultAssets = require('./config/assets/default');
var glob = require('glob');
var gulp = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');
var runSequence = require('run-sequence');
var plugins = gulpLoadPlugins({
  rename: {
    'gulp-angular-templatecache': 'templateCache'
  }
});
var pngquant = require('imagemin-pngquant');
var wiredep = require('wiredep').stream;
var path = require('path');
var endOfLine = require('os').EOL;
var del = require('del');

// Set NODE_ENV to 'development'
gulp.task('env:dev', function () {
  process.env.NODE_ENV = 'development';
});

// Set NODE_ENV to 'production'
gulp.task('env:prod', function () {
  process.env.NODE_ENV = 'production';
});

// Nodemon task
gulp.task('nodemon', function () {
  return plugins.nodemon({
    script: 'server.js',
    nodeArgs: ['--debug'],
    ext: 'js,html',
    verbose: true,
    watch: _.union(defaultAssets.server.views, defaultAssets.server.allJS, defaultAssets.server.config)
  });
});

// Nodemon task without verbosy or debugging
gulp.task('nodemon-nodebug', function () {
  return plugins.nodemon({
    script: 'server.js',
    ext: 'js,html',
    watch: _.union(defaultAssets.server.views, defaultAssets.server.allJS, defaultAssets.server.config)
  });
});

// Watch files for changes
gulp.task('watch', function () {
  // Start refresh
  plugins.refresh.listen();

  // Add watch rules
  gulp.watch(defaultAssets.server.views).on('change', plugins.refresh.changed);
  gulp.watch(defaultAssets.server.allJS, ['eslint']).on('change', plugins.refresh.changed);
  gulp.watch(defaultAssets.client.js, ['eslint']).on('change', plugins.refresh.changed);
  gulp.watch(defaultAssets.client.css, ['csslint']).on('change', plugins.refresh.changed);

  if (process.env.NODE_ENV === 'production') {
    gulp.watch(defaultAssets.server.gulpConfig, ['templatecache', 'eslint']);
    gulp.watch(defaultAssets.client.views, ['templatecache']).on('change', plugins.refresh.changed);
  } else {
    gulp.watch(defaultAssets.server.gulpConfig, ['eslint']);
    gulp.watch(defaultAssets.client.views).on('change', plugins.refresh.changed);
  }
});

// CSS linting task
gulp.task('csslint', function () {
  return gulp.src(defaultAssets.client.css)
    .pipe(plugins.csslint('.csslintrc'))
    .pipe(plugins.csslint.formatter());
});

// ESLint js linting task
gulp.task('eslint', function () {
  var assets = _.union(
    defaultAssets.server.gulpConfig,
    defaultAssets.server.allJS,
    defaultAssets.client.js
  );

  return gulp.src(assets)
    .pipe(plugins.eslint())
    .pipe(plugins.eslint.format());
});

// JS minifying task
gulp.task('uglify', function () {
  var assets = _.union(
    defaultAssets.client.js,
    defaultAssets.client.templates
  );
  del(['public/dist/*']);

  return gulp.src(assets)
    .pipe(plugins.ngAnnotate())
    .pipe(plugins.uglify({
      mangle: false
    }))
    .pipe(plugins.concat('application.min.js'))
    .pipe(plugins.rev())
    .pipe(gulp.dest('public/dist'));
});

// CSS minifying task
gulp.task('cssmin', function () {
  return gulp.src(defaultAssets.client.css)
    .pipe(plugins.csso())
    .pipe(plugins.concat('application.min.css'))
    .pipe(plugins.rev())
    .pipe(gulp.dest('public/dist'));
});

// Imagein task
gulp.task('imagein', function () {
  return gulp.src(defaultAssets.client.img)
    .pipe(plugins.imagein({
      progressive: true,
      svgoPlugins: [{ removeViewBox: false }],
      use: [pngquant()]
    }))
    .pipe(gulp.dest('public/dist/img'));
});

// wiredep task to default
gulp.task('wiredep', function () {
  return gulp.src('config/assets/default.js')
    .pipe(wiredep({
      ignorePath: '../../'
    }))
    .pipe(gulp.dest('config/assets'));
});

// wiredep task to production
gulp.task('wiredep:prod', function () {
  return gulp.src('config/assets/production.js')
    .pipe(wiredep({
      ignorePath: '../../',
      fileTypes: {
        js: {
          replace: {
            css: function (filePath) {
              var minFilePath = filePath.replace('.css', '.min.css');
              var fullPath = path.join(process.cwd(), minFilePath);
              if (!fs.existsSync(fullPath)) {
                return '\'' + filePath + '\',';
              } else {
                return '\'' + minFilePath + '\',';
              }
            },
            js: function (filePath) {
              var minFilePath = filePath.replace('.js', '.min.js');
              var fullPath = path.join(process.cwd(), minFilePath);
              if (!fs.existsSync(fullPath)) {
                return '\'' + filePath + '\',';
              } else {
                return '\'' + minFilePath + '\',';
              }
            }
          }
        }
      }
    }))
    .pipe(gulp.dest('config/assets'));
});

// Make sure upload directory exists
gulp.task('makeUploadsDir', function () {
  return fs.mkdir('modules/users/client/img/profile/uploads', function (err) {
    if (err && err.code !== 'EEXIST') {
      console.error(err);
    }
  });
});

// Angular template cache task
gulp.task('templatecache', function () {
  return gulp.src(defaultAssets.client.views)
    .pipe(plugins.templateCache('templates.js', {
      root: 'modules/',
      module: 'core',
      templateHeader: '(function () {' + endOfLine + '  \'use strict\';' + endOfLine + endOfLine + '  angular' + endOfLine + '    .module(  \'<%= module %>\'<%= standalone %>)' + endOfLine + '    .run(templates);  ' + endOfLine + endOfLine + ' templates.$inject = [\'$templateCache\'];' + endOfLine + endOfLine + 'function templates($templateCache) {' + endOfLine,
      templateBody: '   $templateCache.put(\'<%= url %>\', \'<%= contents %>\');',
      templateFooter: ' }' + endOfLine + '})();' + endOfLine
    }))
    .pipe(gulp.dest('build'));
});

// Lint css and javascript files
gulp.task('lint', function (done) {
  runSequence(['csslint', 'eslint'], done);
});

// Lint project files and minify them into two production files
gulp.task('build', function (done) {
  runSequence('env:dev', 'wiredep:prod', 'lint', ['uglify', 'cssmin'], done);
});

// Run the project in development mode
gulp.task('default', function (done) {
  runSequence('env:dev', ['makeUploadsDir'], 'lint', ['nodemon', 'watch'], done);
});

// Run the project in debug mode
gulp.task('debug', function (done) {
  runSequence('env:dev', ['makeUploadsDir'], 'lint', ['nodemon-nodebug', 'watch'], done);
});

// Run the project in production mode
gulp.task('prod', function (done) {
  runSequence(['makeUploadsDir', 'templatecache'], 'build', 'env:prod', 'lint', ['nodemon-nodebug', 'watch'], done);
});
