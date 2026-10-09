module.exports = function(config) {
  config.set({
    frameworks: ['jasmine'],
    plugins: [
      'karma-jasmine',
      'karma-chrome-launcher',
      'karma-esbuild'
    ],
    files: [
      'src/**/*.test.js'
    ],
    preprocessors: {
      'src/**/*.test.js': ['esbuild']
    },
    esbuild: {
      bundle: true,
      jsx: 'automatic',
      loader: {
        '.js': 'jsx',
        '.jsx': 'jsx'
      }
    },
    browsers: ['ChromeHeadless'],
    singleRun: true,
    reporters: ['progress']
  });
};