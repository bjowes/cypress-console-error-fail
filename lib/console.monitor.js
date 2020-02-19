"use strict";

const util = require("util");

const defaultConfig = { error: true, warn: false };

module.exports = {
  defaultConfig: defaultConfig,
  failOnConsoleConfig: defaultConfig
};

let originalConsoleError = console.error;
let originalConsoleWarn = console.warn;

const errorLogger = function(message, ...optionalParameters) {
  originalConsoleError(message, optionalParameters);
  if (
    evaluateBoolOrFunction(
      module.exports.failOnConsoleConfig.error,
      message,
      optionalParameters
    )
  ) {
    throw new Error(
      "console.error detected:\n" + util.format(message, optionalParameters)
    );
  }
};

const warnLogger = function(message, ...optionalParameters) {
  originalConsoleWarn(message, optionalParameters);
  if (
    evaluateBoolOrFunction(
      module.exports.failOnConsoleConfig.warn,
      message,
      optionalParameters
    )
  ) {
    throw new Error(
      "console.warn detected:\n" + util.format(message, optionalParameters)
    );
  }
};

function evaluateBoolOrFunction(obj, message, optionalParameters) {
  if (typeof obj === "function") {
    return obj(message, optionalParameters);
  }
  return obj;
}

before("Init cypress-console-error-fail", () => {
  Cypress.on("window:load", win => {
    if (console.error !== errorLogger) {
      originalConsoleError = console.error;
      console.error = errorLogger;
    }
    if (console.warn !== warnLogger) {
      originalConsoleWarn = console.warn;
      console.warn = warnLogger;
    }
  });
});

beforeEach("Reset cypress-console-error-fail", () => {
  module.exports.failOnConsoleConfig = defaultConfig;
});
