// Karma configuration file, see link for more information
// https://karma-runner.github.io/0.13/config/configuration-file.html

process.env.CHROME_BIN = require("puppeteer").executablePath();

module.exports = function (config) {
  config.set({
    basePath: "",
    frameworks: ["jasmine", "@angular-devkit/build-angular"],
    plugins: [
      require("karma-jasmine"),
      require("karma-electron"),
      require("karma-chrome-launcher"),
      require("karma-jasmine-html-reporter"),
      require("karma-coverage-istanbul-reporter"),
      require("@angular-devkit/build-angular/plugins/karma"),
    ],
    client: {
      clearContext: false,
    },
    coverageIstanbulReporter: {
      dir: require("path").join(__dirname, "../coverage"),
      reports: ["html", "lcovonly"],
      fixWebpackSourcePaths: true,
    },
    reporters: ["progress", "kjhtml"],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    browserDisconnectTimeout: 15000,
    browsers: ["Cr6"],
    customLaunchers: {
      NgE: {
        base: "Electron",
        flags: ["--remote-debugging-port=9222"],
        browserWindowOptions: {
          webPreferences: {
            nodeIntegration: true,
            nodeIntegrationInSubFrames: true,
            allowRunningInsecureContent: true,
            enableRemoteModule: true,
          },
        },
      },
      Cr6: {
        base: "ChromeHeadless",
        flags: [
          "--disable-extensions",
          "--disable-site-isolation-trials",
          "--disable-translate",
          "--disable-web-security",
          "--remote-debugging-port=9223",
        ],
      },
    },
  });
};
