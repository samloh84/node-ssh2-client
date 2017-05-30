const _ = require('lodash');

const Stats = require('ssh2-streams').SFTPStream.Stats;

/**
 * @memberOf SftpClient#
 * @function stat
 *
 * @param options
 * @param {Buffer} options.path
 *
 * @return {Promise<Stats>}
 * @see {@link https://github.com/mscdex/ssh2-streams/blob/master/SFTPStream.md#sftpstream-methods|SFTPStream methods}
 */
var stat = function (options) {
    var instance = this;

    var fnName = 'stat';

    var fnArgsCallback = function (resolve, reject) {
        var path = _.get(options, 'path');

        var callback = function (err, stats) {
            if (!_.isNil(err)) {
                return reject(err);
            }

            return resolve(stats);
        };

        return [path, callback];
    };

    return instance._call(fnName, fnArgsCallback);

};

module.exports = stat;