/*
 * Code contributed to the webinos project.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * (C) Copyright 2012, TNO
 *
 * Sets up logging for the a2a-stub server. Depends on log4js.
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
