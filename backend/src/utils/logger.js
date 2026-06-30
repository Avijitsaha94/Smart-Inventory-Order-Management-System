/**
 * Logger utility - only logs in development mode
 */
const logger = {
  log: (...args) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(...args);
    }
  },
  error: (...args) => {
    if (process.env.NODE_ENV !== 'production') {
      console.error(...args);
    }
  },
  warn: (...args) => {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(...args);
    }
  },
};

module.exports = logger;