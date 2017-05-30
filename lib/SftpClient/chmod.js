const _ = require('lodash');

/**
 * @memberOf SftpClient#
 * @function chmod
 *
 * @param options
 * @param {Buffer} options.handle
 * @param {Number} options.mode
 *
 * @return {Promise<undefined>}
 * @see {@link https://github.com/mscdex/ssh2-streams/blob/master/SFTPStream.md#sftpstream-methods|SFTPStream methods}
 */
var chmod = function (options) {
    var instance = this;

    var fnName = 'chmod';

    var fnArgsCallback = function (resolve, reject) {
        var path = _.get(options, 'path');
        var mode = _.get(options, 'mode');

        var callback = function (err) {
            if (!_.isNil(err)) {
                return reject(err);
            }

            return resolve();
        };

        return [path, mode, callback];
    };


    return instance._call(fnName, fnArgsCallback);

};

module.exports = chmod;