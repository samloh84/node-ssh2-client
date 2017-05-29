const _ = require('lodash');

const Stats = require('ssh2-streams').SFTPStream.Stats;

/**
 * @memberOf SftpClient#
 * @function fstat
 *
 * @param options
 * @param {Buffer} options.handle
 *
 * @return {Promise<Stats>}
 * @see {@link https://github.com/mscdex/ssh2-streams/blob/master/SFTPStream.md#sftpstream-methods|SFTPStream methods}
 */
var fstat = function (options) {
    var instance = this;

    var fnName = 'fstat';

    var fnArgsCallback = function (resolve, reject) {
        var handle = _.get(options, 'handle');

        var callback = function (err, stats) {
            if (!_.isNil(err)) {
                return reject(err);
            }

            return resolve(stats);
        };

        return [handle, callback];
    };

    return instance._call(fnName, fnArgsCallback);

};

module.exports = fstat;