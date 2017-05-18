/**
 * @memberOf SftpUtil#
 * @function read
 *
 * @param options
 * @param {Buffer} options.handle
 * @param {Buffer} options.buffer
 * @param {Number} options.offset
 * @param {Number} options.length
 * @param {Number} options.position
 *
 * @return {Promise<{bytesRead:Number, buffer:Buffer,position:Number}>}
 * @see {@link https://github.com/mscdex/ssh2-streams/blob/master/SFTPStream.md#sftpstream-methods|SFTPStream methods}
 */
var read = function (options) {
    var instance = this;

    var fnName = 'read';

    var fnArgsCallback = function (resolve, reject) {
        var handle = _.get(options, 'handle');
        var buffer = _.get(options, 'buffer');
        var offset = _.get(options, 'offset');
        var length = _.get(options, 'length');
        var position = _.get(options, 'position');

        var callback = function (err, bytesRead, buffer, position) {
            if (!_.isNil(err)) {
                return reject(err);
            }

            return resolve({bytesRead: bytesRead, buffer: buffer, position: position});
        };

        return [handle, buffer, offset, length, position, callback];
    };const _ = require('lodash');



    return instance._call(fnName, fnArgsCallback);
};

module.exports = read;