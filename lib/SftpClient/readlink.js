const _ = require('lodash');

/**
 * @memberOf SftpClient#
 * @function readlink
 *
 * @param options
 * @param {Buffer} options.path
 *
 * @return {Promise<String>}
 * @see {@link https://github.com/mscdex/ssh2-streams/blob/master/SFTPStream.md#sftpstream-methods|SFTPStream methods}
 */
var readlink = function (options) {
    var instance = this;

    var fnName = 'readlink';

    var fnArgsCallback = function (resolve, reject) {
        var path = _.get(options, 'path');

        var callback = function (err, target) {
            if (!_.isNil(err)) {
                return reject(err);
            }

            return resolve(target);
        };

        return [path, callback];
    };

    return instance._call(fnName, fnArgsCallback);
};

module.exports = readlink;