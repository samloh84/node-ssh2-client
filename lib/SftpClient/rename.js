const _ = require('lodash');

/**
 * @memberOf SftpClient#
 * @function rename
 *
 * @param options
 * @param {Buffer} options.srcPath
 * @param {Buffer} options.destPath
 *
 * @return {Promise<undefined>}
 * @see {@link https://github.com/mscdex/ssh2-streams/blob/master/SFTPStream.md#sftpstream-methods|SFTPStream methods}
 */
var rename = function (options) {
    var instance = this;

    var fnName = 'rename';

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

module.exports = rename;