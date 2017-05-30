const _ = require('lodash');
/**
 * @memberOf SftpClient#
 * @function utimes
 *
 * @param options
 * @param {Buffer} options.path
 * @param {Object} options.atime
 * @param {Object} options.mtime
 *
 * @return {Promise<undefined>}
 * @see {@link https://github.com/mscdex/ssh2-streams/blob/master/SFTPStream.md#sftpstream-methods|SFTPStream methods}
 */
var utimes = function (options) {
    var instance = this;

    var fnName = 'utimes';

    var fnArgsCallback = function (resolve, reject) {
        var path = _.get(options, 'path');
        var atime = _.get(options, 'atime');
        var mtime = _.get(options, 'mtime');

        var callback = function (err) {
            if (!_.isNil(err)) {
                return reject(err);
            }

            return resolve();
        };

        return [path, atime, mtime, callback];
    };

    return instance._call(fnName, fnArgsCallback);

};

module.exports = utimes;