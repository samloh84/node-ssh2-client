const _ = require('lodash');

/**
 * @memberOf SftpClient#
 * @function readdir
 *
 * @param options
 * @param {Buffer} options.location
 *
 * @return {Promise<{String[]}>}
 * @see {@link https://github.com/mscdex/ssh2-streams/blob/master/SFTPStream.md#sftpstream-methods|SFTPStream methods}
 */
var readdir = function (options) {
    var instance = this;

    var fnName = 'readdir';

    var fnArgsCallback = function (resolve, reject) {
        var location = _.get(options, 'location');

        var callback = function (err, list) {
            if (!_.isNil(err)) {
                return reject(err);
            }

            return resolve(list);
        };

        return [location, callback];
    };

    return instance._call(fnName, fnArgsCallback);
};

module.exports = readdir;