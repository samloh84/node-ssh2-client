const _ = require('lodash');

/**
 * @memberOf SftpUtil#
 * @function opendir
 *
 * @param options
 * @param options.path
 *
 * @return {Promise<Buffer>}
 * @see {@link https://github.com/mscdex/ssh2-streams/blob/master/SFTPStream.md#sftpstream-methods|SFTPStream methods}
 */
var opendir = function (options) {
    var instance = this;

    var fnName = 'opendir';

    var fnArgsCallback = function (resolve, reject) {
        var path = _.get(options, 'path');

        var callback = function (err, handle) {
            if (!_.isNil(err)) {
                return reject(err);
            }

            return resolve(handle);
        };

        return [path, callback];
    };

    return instance._call(fnName, fnArgsCallback);
};

module.exports = opendir;