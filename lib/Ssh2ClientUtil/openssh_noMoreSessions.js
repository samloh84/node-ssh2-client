const Promise = require('bluebird');
const _ = require('lodash');

/**
 * @memberOf Ssh2ClientUtil#
 * @function openssh_noMoreSessions
 *
 * @param options
 * @param {remoteAddr} options.remoteAddr
 * @param {remotePort} options.remotePort
 * @return {Promise<undefined>}
 */
var openssh_noMoreSessions = function (options) {
    var instance = this;

    var fnName = 'openssh_noMoreSessions';

    var fnArgsCallback = function (resolve, reject) {

        var callback = function (err) {
            if (!_.isNil(err)) {
                return reject(err);
            }

            return resolve();
        };

        return [callback];
    };

    return instance._call(fnName, fnArgsCallback);

};

module.exports = openssh_noMoreSessions;