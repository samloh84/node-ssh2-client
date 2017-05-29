const _ = require('lodash');


/**
 * @typedef {Object} Ssh2ClientExecPseudoTtySettings
 * @property {Number} rows
 * @property {Number} cols
 * @property {Number} height
 * @property {Number} width
 * @property {String} term
 *
 */

/**
 * @typedef {Object} Ssh2ClientExecPseudoTtySettings
 * @property {Number} rows
 * @property {Number} cols
 * @property {Number} height
 * @property {Number} width
 * @property {String} term
 *
 */

/**
 * @memberOf Ssh2Client#
 * @function exec
 *
 * @param options
 * @param options.command
 * @param options.env
 * @param {Ssh2ClientExecPseudoTtySettings} options.pty
 * @param options.x11
 * @return {Promise<Channel>}
 */
var exec = function (options) {
    var instance = this;

    var fnName = 'exec';

    var fnArgsCallback = function (resolve, reject) {
        var command = _.get(options, 'command');

        var execArgs = [command];

        var env = _.get(options, 'env');
        var pty = _.get(options, 'pty');
        var x11 = _.get(options, 'x11');

        var execOptions = {
            env: env,
            pty: pty,
            x11: x11
        };
        execOptions = _.omitBy(execOptions, _.isUndefined);

        if (!_.isEmpty(execOptions)) {
            execArgs.push(execOptions);
        }

        var callback = function (err, stream) {
            if (!_.isNil(err)) {
                return reject(err);
            }

            return resolve(stream);
        };

        execArgs.push(callback);

        return execArgs;
    };

    return instance._call(fnName, fnArgsCallback);

};

module.exports = exec;