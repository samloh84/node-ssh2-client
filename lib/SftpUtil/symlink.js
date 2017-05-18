const _ = require('lodash');

/**
 * @memberOf SftpUtil#
 * @function symlink
 *
 * @param options
 * @param {Buffer} options.targetPath
 * @param {Buffer} options.linkPath
 *
 * @return {Promise<undefined>}
 * @see {@link https://github.com/mscdex/ssh2-streams/blob/master/SFTPStream.md#sftpstream-methods|SFTPStream methods}
 */
var symlink = function (options) {
    var instance = this;

    var fnName = 'symlink';

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

module.exports = symlink;