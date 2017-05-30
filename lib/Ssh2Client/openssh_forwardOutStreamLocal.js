const Promise = require('bluebird');
const _ = require('lodash');

/**
 * @memberOf Ssh2Client#
 * @function openssh_forwardOutStreamLocal
 *
 * @param options
 * @param {remoteAddr} options.remoteAddr
 * @param {remotePort} options.remotePort
 * @return {Promise<undefined>}
 */
var openssh_forwardOutStreamLocal = function (options) {
    var instance = this;

    var fnName = 'openssh_forwardOutStreamLocal';

    var fnArgsCallback = function (resolve, reject) {

        var socketPath = _.get(options, 'socketPath');

        var callback = function (err, stream) {
            if (!_.isNil(err)) {
                return reject(err);
            }

            return resolve(stream);
        };

        return [socketPath, callback];
    };

    return instance._call(fnName, fnArgsCallback);

};

module.exports = openssh_forwardOutStreamLocal;