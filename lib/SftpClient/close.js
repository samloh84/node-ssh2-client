const _ = require('lodash');

/**
 * @memberOf SftpClient#
 * @function close
 *
 * @param options
 * @param options.handle
 *
 * @return {Promise<undefined>}
 * @see {@link https://github.com/mscdex/ssh2-streams/blob/master/SFTPStream.md#sftpstream-methods|SFTPStream methods}
 */
var close = function (options) {
    var instance = this;

    var fnName = 'close';

    var fnArgsCallback = function (resolve, reject) {
        var handle = _.get(options, 'handle');

        var callback = function (err) {
            if (!_.isNil(err)) {
                return reject(err);
            }

            return resolve();
        };


        return [handle, callback];
    };


    return instance._call(fnName, fnArgsCallback);
};

module.exports = close;