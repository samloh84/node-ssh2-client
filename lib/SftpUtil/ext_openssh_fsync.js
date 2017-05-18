const _ = require('lodash');

/**
 * @memberOf SftpUtil#
 * @function ext_openssh_fsync
 *
 * @param options
 * @param {Buffer} options.handle
 *
 * @return {Promise<undefined>}
 * @see {@link https://github.com/mscdex/ssh2-streams/blob/master/SFTPStream.md#sftpstream-methods|SFTPStream methods}
 */
var ext_openssh_fsync = function (options) {
    var instance = this;

    var fnName = 'ext_openssh_fsync';

    var fnArgsCallback = function (resolve, reject) {
        var handle = _.get(options, 'handle');

        var callback = function (err) {
            if (!_.isNil(err)) {
                return reject(err);
            }

            return resolve();
        };

        return [handle, callback];
    };

    return instance._call(fnName, fnArgsCallback);

};

module.exports = ext_openssh_fsync;