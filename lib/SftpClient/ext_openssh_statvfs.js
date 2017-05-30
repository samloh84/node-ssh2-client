const _ = require('lodash');

/**
 * @memberOf SftpClient#
 * @function ext_openssh_statvfs
 *
 * @param options
 * @param {Buffer} options.handle
 *
 * @return {Promise<Object>}
 * @see {@link https://github.com/mscdex/ssh2-streams/blob/master/SFTPStream.md#sftpstream-methods|SFTPStream methods}
 */
var ext_openssh_statvfs = function (options) {
    var instance = this;

    var fnName = 'ext_openssh_statvfs';

    var fnArgsCallback = function (resolve, reject) {
        var path = _.get(options, 'path');

        var callback = function (err, fsInfo) {
            if (!_.isNil(err)) {
                return reject(err);
            }

            return resolve(fsInfo);
        };

        return [path, callback];
    };

    return instance._call(fnName, fnArgsCallback);

};

module.exports = ext_openssh_statvfs;