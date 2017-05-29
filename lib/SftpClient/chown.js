const _ = require('lodash');

/**
 * @memberOf SftpClient#
 * @function chown
 *
 * @param options
 * @param {Buffer} options.handle
 * @param {Number} options.uid
 * @param {Number} options.gid
 *
 * @return {Promise<undefined>}
 * @see {@link https://github.com/mscdex/ssh2-streams/blob/master/SFTPStream.md#sftpstream-methods|SFTPStream methods}
 */
var chown = function (options) {
    var instance = this;

    var fnName = 'chown';

    var fnArgsCallback = function (resolve, reject) {
        var path = _.get(options, 'path');
        var uid = _.get(options, 'uid');
        var gid = _.get(options, 'gid');

        var callback = function (err) {
            if (!_.isNil(err)) {
                return reject(err);
            }

            return resolve();
        };

        return [path, uid, gid, callback];
    };

    return instance._call(fnName, fnArgsCallback);

};

module.exports = chown;