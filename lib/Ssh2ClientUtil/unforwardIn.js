const Promise = require('bluebird');
const _ = require('lodash');

/**
 * @memberOf Ssh2ClientUtil#
 * @function unforwardIn
 *
 * @param options
 * @param {remoteAddr} options.remoteAddr
 * @param {remotePort} options.remotePort
 * @return {Promise<undefined>}
 */
var unforwardIn = function (options) {
    var instance = this;

    var fnName = 'unforwardIn';

    var fnArgsCallback = function (resolve, reject) {
        var remoteAddr = _.get(options, 'remoteAddr');
        var remotePort = _.get(options, 'remotePort');

        var callback = function (err ) {
            if (!_.isNil(err)) {
                return reject(err);
            }

            return resolve();
        };

        return [remoteAddr, remotePort, callback];
    };

    return instance._call(fnName, fnArgsCallback);

};

module.exports = unforwardIn;