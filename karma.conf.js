module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
        './bower_components/angular/angular.js',
        './bower_components/angular-mocks/angular-mocks.js',
        './src/**/*.js',
        './test/**/*.spec.js'
    ],
    exclude: [],
    reporters: ['progress', 'html'],
    htmlReporter: {
        outputDir: './karma_report'
    },
    port: 8080,
    colors: true,
    logLevel: config.LOG_DEBUG,
    autoWatch: true,
    autoWatchInterval: 100,
    browsers: ['PhantomJS'],
    singleRun: false
  });
};