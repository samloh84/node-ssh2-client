const _ = require('lodash');

/**
 * @memberOf SftpClient#
 * @function ext_openssh_rename
 *
 * @param options
 * @param {Buffer} options.handle
 *
 * @return {Promise<undefined>}
 * @see {@link https://github.com/mscdex/ssh2-streams/blob/master/SFTPStream.md#sftpstream-methods|SFTPStream methods}
 */
var ext_openssh_rename = function (options) {
    var instance = this;

    var fnName = 'ext_openssh_rename';

    var fnArgsCallback = function (resolve, reject) {
        var srcPath = _.get(options, 'srcPath');
        var destPath = _.get(options, 'destPath');

        var callback = function (err) {
            if (!_.isNil(err)) {
                return reject(err);
            }

            return resolve();
        };

        return [srcPath, destPath, callback];
    };

    return instance._call(fnName, fnArgsCallback);

};

module.exports = ext_openssh_rename;