import log from "loglevel";
import chalk from "chalk";

log.setLevel(log.levels.DEBUG);

const trace = (message, ...optionalParams) => {
  log.trace(chalk.green(message), ...optionalParams);
};

const debug = (message, ...optionalParams) => {
  log.debug(chalk.blue(message), ...optionalParams);
};

const info = (message, ...optionalParams) => {
  log.info(chalk.white(message), ...optionalParams);
};

const warn = (message, ...optionalParams) => {
  log.warn(chalk.yellow(message), ...optionalParams);
};

const error = (message, ...optionalParams) => {
  log.error(chalk.red(message), ...optionalParams);
};

export default {
  trace,
  debug,
  info,
  warn,
  error,
};
