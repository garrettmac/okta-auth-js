/*!
 * Copyright (c) 2019-Present, Okta, Inc. and/or its affiliates. All rights reserved.
 * The Okta software accompanied by this notice is provided pursuant to the Apache License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and limitations under the License.
 */

// Karma configuration file, see link for more information
// http://karma-runner.github.io/3.0/config/configuration-file.html

var path = require('path');

var ROOT_DIR = path.resolve(__dirname, '..', '..');
var REPORTS_DIR = path.join(ROOT_DIR, 'build2', 'reports', 'karma');
var webpackConf =  require('./webpack.karma.config');

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', 'jquery-3.3.1'],
    plugins: [
      'karma-jasmine',
      'karma-chrome-launcher',
      'karma-coverage-istanbul-reporter',
      'karma-webpack',
      'karma-jquery',
      'karma-sourcemap-loader',
      'karma-coverage'
    ],
    files: [
      { pattern: './test/karma/main.js', watched: false }
    ],
    preprocessors: {
      'test/karma/main.js': ['webpack', 'sourcemap', 'coverage']
    },
    webpack: webpackConf,
    webpackMiddleware: {
      stats: 'normal',
    },
    client: {
      jasmine: {
        random: true, // Default: true. Tests should have no effect on other tests
        timeoutInterval: 5000 // Default: 5000. Can increase locally when debugging
      },
      // Passing specific test to run
      // but this works only with `karma start`, not `karma run`.
      test: config.test,
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    coverageIstanbulReporter: {
      dir: REPORTS_DIR,
      reports: [ 'html', 'lcovonly','text-summary' ],
      fixWebpackSourcePaths: true
    },
    reporters: ['progress', 'coverage-istanbul', 'coverage'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['ChromeHeadlessNoSandbox'],
    concurrency: 1,
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox']
      }
    },
    singleRun: false
  });
};
