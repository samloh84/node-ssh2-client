const Promise = require('bluebird');
const _ = require('lodash');

/**
 * @memberOf Ssh2ClientUtil#
 * @function _call
 *
 * @param fnName
 * @param fnArgsCallback
 * @return {Promise<*>}
 * @private
 */
var _call = function (fnName, fnArgsCallback) {
    var instance = this;

    return instance._connect()
        .then(function (client) {
            var promise = function () {
                return new Promise(function (resolve, reject) {
                    try {
                        var fn = client[fnName];
                        var fnArgs = fnArgsCallback(resolve, reject);

                        var wait = !fn.apply(client, fnArgs);
                        if (wait) {
                            client.once('continue', function () {
                                return promise().then(resolve);
                            });
                        }
                    } catch (err) {
                        return reject(err);
                    }
                })
            };

            return promise();
        });
};

module.exports = _call;