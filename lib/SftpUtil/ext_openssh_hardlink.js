const _ = require('lodash');

/**
 * @memberOf SftpUtil#
 * @function ext_openssh_hardlink
 *
 * @param options
 * @param {Buffer} options.targetPath
 * @param {Buffer} options.linkPath
 *
 * @return {Promise<undefined>}
 * @see {@link https://github.com/mscdex/ssh2-streams/blob/master/SFTPStream.md#sftpstream-methods|SFTPStream methods}
 */
var ext_openssh_hardlink = function (options) {
    var instance = this;

    var fnName = 'ext_openssh_hardlink';

    var fnArgsCallback = function (resolve, reject) {
        var targetPath = _.get(options, 'targetPath');
        var linkPath = _.get(options, 'linkPath');

        var callback = function (err) {
            if (!_.isNil(err)) {
                return reject(err);
            }

            return resolve();
        };

        return [targetPath, linkPath, callback];
    };

    return instance._call(fnName, fnArgsCallback);

};

module.exports = ext_openssh_hardlink;