const Promise = require('bluebird');
const _ = require('lodash');

/**
 * @memberOf SftpUtil#
 * @function _call
 *
 * @param fnName
 * @param fnArgsCallback
 * @return {Promise<*>}
 * @private
 */
var _call = function (fnName, fnArgsCallback) {
    var instance = this;

    return instance._getSftpWrapper()
        .then(function (sftpWrapper) {
            var promise = function () {
                return new Promise(function (resolve, reject) {
                    try {
                        var fn = sftpWrapper[fnName];
                        var fnArgs = fnArgsCallback(resolve, reject);

                        var wait = !fn.apply(sftpWrapper, fnArgs);
                        if (wait) {
                            sftpWrapper.once('continue', function () {
                                return promise().then(resolve);
                            });
                        }
                    } catch (err) {
                        return reject(err);
                    }
                });


            };

            return promise();
        });
};

module.exports = _call;