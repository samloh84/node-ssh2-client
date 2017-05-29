const Promise = require('bluebird');
const _ = require('lodash');

/**
 * @typedef {Object} Ssh2ClientShellPseudoTtySettings
 * @property {Number} rows
 * @property {Number} cols
 * @property {Number} height
 * @property {Number} width
 * @property {String} term
 *
 */

/**
 * @typedef {Object} Ssh2ClientShellX11Settings
 * @property {Boolean} single
 * @property {Number} screen
 *
 */


/**
 * @memberOf Ssh2Client#
 * @function shell
 *
 * @param options
 * @param {Ssh2ClientShellPseudoTtySettings|Boolean} options.window
 * @param {Object} options.env
 * @param {Ssh2ClientShellX11Settings|Boolean} options.x11
 * @return {Promise<Channel>}
 */
var shell = function (options) {
    var instance = this;


    var fnName = 'shell';

    var fnArgsCallback = function (resolve, reject) {

        var shellArgs = [];

        var window = _.get(options, 'window');
        if (!_.isNil(window)) {
            shellArgs.push(window);
        }

        var env = _.get(options, 'env');
        var x11 = _.get(options, 'x11');

        var shellOptions = {
            env: env,
            x11: x11
        };
        shellOptions = _.omitBy(shellOptions, _.isUndefined);

        shellArgs.push(shellOptions);

        var callback = function (err, stream) {
            if (!_.isNil(err)) {
                return reject(err);
            }

            return resolve(stream);
        };

        shellArgs.push(callback);

        return shellArgs;
    };

    return instance._call(fnName, fnArgsCallback);
};

module.exports = shell;