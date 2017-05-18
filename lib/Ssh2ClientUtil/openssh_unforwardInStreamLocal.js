const Promise = require('bluebird');
const _ = require('lodash');

/**
 * @memberOf Ssh2ClientUtil#
 * @function openssh_unforwardInStreamLocal
 *
 * @param options
 * @param {remoteAddr} options.remoteAddr
 * @param {remotePort} options.remotePort
 * @return {Promise<undefined>}
 */
var openssh_unforwardInStreamLocal = function (options) {
    var instance = this;

    var fnName = 'openssh_unforwardInStreamLocal';

    var fnArgsCallback = function (resolve, reject) {

        var socketPath = _.get(options, 'socketPath');

        var callback = function (err) {
            if (!_.isNil(err)) {
                return reject(err);
            }

            return resolve();
        };

        return [socketPath, callback];
    };

    return instance._call(fnName, fnArgsCallback);

};

module.exports = openssh_unforwardInStreamLocal;