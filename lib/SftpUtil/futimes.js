const _ = require('lodash');

/**
 * @memberOf SftpUtil#
 * @function futimes
 *
 * @param options
 * @param {Buffer} options.handle
 * @param {Object} options.attributes
 *
 * @return {Promise<undefined>}
 * @see {@link https://github.com/mscdex/ssh2-streams/blob/master/SFTPStream.md#sftpstream-methods|SFTPStream methods}
 */
var futimes = function (options) {
    var instance = this;

    var fnName = 'futimes';

    var fnArgsCallback = function (resolve, reject) {
        var handle = _.get(options, 'handle');
        var atime = _.get(options, 'atime');
        var mtime = _.get(options, 'mtime');

        var callback = function (err) {
            if (!_.isNil(err)) {
                return reject(err);
            }

            return resolve();
        };

        return [handle, atime, mtime, callback];
    };

    return instance._call(fnName, fnArgsCallback);

};

module.exports = futimes;