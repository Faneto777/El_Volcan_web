const fs = require('fs')
const esbuild = require('esbuild')
const { createInstrumenter } = require('istanbul-lib-instrument')

const instrumenter = createInstrumenter({
  esModules: true,
  produceSourceMap: true,
  coverageVariable: '__coverage__',
})

const pluginCobertura = {
  name: 'cobertura-istanbul',
  setup(build) {
    build.onLoad({ filter: /[\\/]src[\\/].*\.jsx?$/ }, async (args) => {
      if (/\.test\.js$/.test(args.path)) return null // los tests no se miden
      const original = fs.readFileSync(args.path, 'utf8')
      // 1) JSX -> JS, conservando el mapa para que el reporte muestre tus líneas originales
      const { code, map } = await esbuild.transform(original, {
        loader: 'jsx',
        jsx: 'automatic',
        sourcemap: 'external',
        sourcefile: args.path,
      })
      
      const instrumentado = instrumenter.instrumentSync(code, args.path, JSON.parse(map))
      return { contents: instrumentado, loader: 'js' }
    })
  },
}

module.exports = function (config) {
  config.set({
    frameworks: ['jasmine'],
    plugins: [
      'karma-jasmine',
      'karma-chrome-launcher',
      'karma-esbuild',
      'karma-coverage'
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
      },
      plugins: [pluginCobertura]
    },
    browsers: ['ChromeHeadless'],
    singleRun: true,
    reporters: ['progress', 'coverage'],
    coverageReporter: {
      dir: 'coverage',
      subdir: '.',
      reporters: [
        { type: 'html' },
        { type: 'text-summary' },
        { type: 'text' }
      ]
    }
  })
}