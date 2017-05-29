const _ = require('lodash');

/**
 * @memberOf SftpClient#
 * @function fchown
 *
 * @param options
 * @param {Buffer} options.handle
 * @param {Number} options.uid
 * @param {Number} options.gid
 *
 * @return {Promise<undefined>}
 * @see {@link https://github.com/mscdex/ssh2-streams/blob/master/SFTPStream.md#sftpstream-methods|SFTPStream methods}
 */
var fchown = function (options) {
    var instance = this;

    var fnName = 'fchown';

    var fnArgsCallback = function (resolve, reject) {
        var handle = _.get(options, 'handle');
        var uid = _.get(options, 'uid');
        var gid = _.get(options, 'gid');

        var callback = function (err) {
            if (!_.isNil(err)) {
                return reject(err);
            }

            return resolve();
        };

        return [handle, uid, gid, callback];
    };

    return instance._call(fnName, fnArgsCallback);

};

module.exports = fchown;