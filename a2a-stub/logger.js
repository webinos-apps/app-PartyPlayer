/**
 * a2a-logger
 *
 * Sets up logging for the a2a-stub server. Depends on log4js.
 *
 * Author: Victor Klos
 */
var log4js = require('log4js') || die('Did you npm install log4js?');
var basename = (new Date()).toISOString().replace(/:/g,'').replace(/T/g,'_').replace(/\..*Z$/,'');
log4js.configure({
    appenders: [
        { type: 'console' },
        { type: 'file', filename: 'logs/' + basename + '.log' },
        { type: 'file', filename: 'logs/latest.log' },
    ]
}, {});
var logger = log4js.getLogger('a2a-stub') || die('setLogger failed. Check config?!');

module.exports = logger;
module.exports.die = function die(str) {
    if (typeof logger === 'object') {
        logger.error(str);
    } else {
        console.error('ERROR: ' + str);
    }
    process.exit(1);
};
