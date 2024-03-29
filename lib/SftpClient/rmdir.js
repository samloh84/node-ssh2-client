const _ = require('lodash');

/**
 * @memberOf SftpClient#
 * @function rmdir
 *
 * @param options
 * @param {Buffer} options.path
 *
 * @return {Promise<undefined>}
 * @see {@link https://github.com/mscdex/ssh2-streams/blob/master/SFTPStream.md#sftpstream-methods|SFTPStream methods}
 */
var rmdir = function (options) {
    var instance = this;

    var fnName = 'rmdir';

    var fnArgsCallback = function (resolve, reject) {
        var path = _.get(options, 'path');

        var callback = function (err) {
            if (!_.isNil(err)) {
                return reject(err);
            }

            return resolve();
        };

        return [path, callback];
    };

    return instance._call(fnName, fnArgsCallback);

};

module.exports = rmdir;


