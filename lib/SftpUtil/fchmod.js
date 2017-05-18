const _ = require('lodash');

/**
 * @memberOf SftpUtil#
 * @function fchmod
 *
 * @param options
 * @param {Buffer} options.handle
 * @param {Number} options.mode
 *
 * @return {Promise<undefined>}
 * @see {@link https://github.com/mscdex/ssh2-streams/blob/master/SFTPStream.md#sftpstream-methods|SFTPStream methods}
 */
var fchmod = function (options) {
    var instance = this;

    var fnName = 'fchmod';

    var fnArgsCallback = function (resolve, reject) {
        var handle = _.get(options, 'handle');
        var mode = _.get(options, 'mode');

        var callback = function (err) {
            if (!_.isNil(err)) {
                return reject(err);
            }

            return resolve();
        };

        return [handle, mode, callback];
    };


    return instance._call(fnName, fnArgsCallback);

};

module.exports = fchmod;