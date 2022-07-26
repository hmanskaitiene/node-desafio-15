const logger = require('../utils/logger.js')

const loggerMiddleware = (req, res, next) => {
    logger.info(`${req.method} at ${req.path}`);
    next();
}

module.exports = loggerMiddleware;