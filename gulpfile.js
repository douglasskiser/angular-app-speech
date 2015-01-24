(function() {
    'use strict';

    var gulp = require('gulp'),
        plugins = require('gulp-load-plugins')({
            lazy: false
        }),
        path = require('path'),
        karma = require('karma').server;

    var paths = {
        conf: {
            karma: './karma.conf.js'
        },
        js: {
            src: './src/**/*.js',
            test: './test/**/*.spec.js'
        },
        dest: './dist'
    };

    function karmaTest(cb) {
        return karma.start({
            configFile: path.resolve(paths.conf.karma),
            singleRun: true
        }, cb);
    }

    function lint() {
        return gulp.src([paths.js.src, paths.js.test])
            .pipe(plugins.jshint())
            .pipe(plugins.jshint.reporter('default'));
    }

    function build() {
        return gulp.src(paths.js.src)
            .pipe(plugins.uglify())
            .pipe(plugins.rename('app-speech.min.js'))
            .pipe(gulp.dest(paths.dest));
    }

    function createTask(task) {
        if (!task.deps) return gulp.task(task.name, task.task);
        return gulp.task(task.name, task.deps, task.task);
    }

    return [{
            name: 'karma',
            task: karmaTest,
            deps: ['lint']
        }, {
            name: 'lint',
            task: lint
        }, {
            name: 'build',
            task: build
        }, {
            name: 'default',
            task: build,
            deps: ['karma']
        }]
        .forEach(function(task) {
            return createTask(task);
        });
}());
