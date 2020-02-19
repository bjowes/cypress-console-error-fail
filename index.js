"use strict";

const consoleMonitor = require("./lib/console.monitor");

Cypress.Commands.add("failOnConsole", config => {
  Cypress.log({ name: "failOnConsole", message: config });
  if (!config) {
    consoleMonitor.failOnConsoleConfig = consoleMonitor.defaultConfig;
    return;
  }
  if (config.error === undefined) {
    throw new Error("Invalid argument, must include an error property");
  }
  if (config.warn === undefined) {
    throw new Error("Invalid argument, must include a warn property");
  }
  consoleMonitor.failOnConsoleConfig = config;
});
