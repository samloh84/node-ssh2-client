const Promise = require('bluebird');
const _ = require('lodash');

/**
 * @memberOf Ssh2ClientUtil#
 * @function forwardIn
 *
 * @param options
 * @param {remoteAddr} options.remoteAddr
 * @param {remotePort} options.remotePort
 * @return {Promise<Number>} remotePort
 */
var forwardIn = function (options) {
    var instance = this;

    var fnName = 'forwardIn';

    var fnArgsCallback = function (resolve, reject) {
        var remoteAddr = _.get(options, 'remoteAddr');
        var remotePort = _.get(options, 'remotePort');

        var callback = function (err, port) {
            if (!_.isNil(err)) {
                return reject(err);
            }

            return resolve(port);
        };

        return [remoteAddr, remotePort, callback];
    };

    return instance._call(fnName, fnArgsCallback);

};

module.exports = forwardIn;