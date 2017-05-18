const _ = require('lodash');

/**
 * @memberOf SftpUtil#
 * @function realpath
 *
 * @param options
 * @param {Buffer} options.path
 *
 * @return {Promise<String>}
 * @see {@link https://github.com/mscdex/ssh2-streams/blob/master/SFTPStream.md#sftpstream-methods|SFTPStream methods}
 */
var realpath = function (options) {
    var instance = this;

    var fnName = 'realpath';

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

module.exports = realpath;