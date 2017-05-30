const _ = require('lodash');

/**
 * @memberOf SftpClient#
 * @function open
 *
 * @param options
 * @param options.filename
 * @param options.flags
 * @param options.mode
 *
 * @return {Promise<undefined>}
 * @see {@link https://github.com/mscdex/ssh2-streams/blob/master/SFTPStream.md#sftpstream-methods|SFTPStream methods}
 */
var open = function (options) {
    var instance = this;

    var fnName = 'open';

    var fnArgsCallback = function (resolve, reject) {
        var filename = _.get(options, 'filename');
        var flags = _.get(options, 'flags');
        var mode = _.get(options, 'mode');

        var openArgs = [filename, flags];

        if (!_.isNil(mode)) {
            openArgs.push(mode);
        }

        var callback = function (err, handle) {
            if (!_.isNil(err)) {
                return reject(err);
            }

            return resolve(handle);
        };

        openArgs.push(callback);

        return openArgs;
    };

    return instance._call(fnName, fnArgsCallback);


};

module.exports = open;