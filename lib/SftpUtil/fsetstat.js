const _ = require('lodash');

/**
 * @memberOf SftpUtil#
 * @function fsetstat
 *
 * @param options
 * @param {Buffer} options.handle
 * @param {Object} options.attributes
 *
 * @return {Promise<undefined>}
 * @see {@link https://github.com/mscdex/ssh2-streams/blob/master/SFTPStream.md#sftpstream-methods|SFTPStream methods}
 */
var fsetstat = function (options) {
    var instance = this;

    var fnName = 'fsetstat';

    var fnArgsCallback = function (resolve, reject) {
        var handle = _.get(options, 'handle');
        var attributes = _.get(options, 'attributes');

        var callback = function (err) {
            if (!_.isNil(err)) {
                return reject(err);
            }

            return resolve();
        };

        return [handle, attributes, callback];
    };

    return instance._call(fnName, fnArgsCallback);

};

module.exports = fsetstat;