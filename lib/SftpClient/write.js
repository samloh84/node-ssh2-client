const _ = require('lodash');

/**
 * @memberOf SftpClient#
 * @function write
 *
 * @param options
 * @param {Buffer} options.handle
 * @param {Buffer} options.buffer
 * @param {Number} options.offset
 * @param {Number} options.length
 * @param {Number} options.position
 *
 * @return {Promise<undefined>}
 * @see {@link https://github.com/mscdex/ssh2-streams/blob/master/SFTPStream.md#sftpstream-methods|SFTPStream methods}
 */
var write = function (options) {
    var instance = this;

    var fnName = 'write';

    var fnArgsCallback = function (resolve, reject) {
        var handle = _.get(options, 'handle');
        var buffer = _.get(options, 'buffer');
        var offset = _.get(options, 'offset');
        var length = _.get(options, 'length');
        var position = _.get(options, 'position');

        var callback = function (err) {
            if (!_.isNil(err)) {
                return reject(err);
            }

            return resolve();
        };

        return [handle, buffer, offset, length, position, callback];
    };

    return instance._call(fnName, fnArgsCallback);

};

module.exports = write;