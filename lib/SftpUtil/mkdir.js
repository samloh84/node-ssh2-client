const _ = require('lodash');

/**
 * @memberOf SftpUtil#
 * @function mkdir
 *
 * @param options
 * @param {Buffer} options.path
 * @param {Buffer} options.attributes
 *
 * @return {Promise<undefined>}
 * @see {@link https://github.com/mscdex/ssh2-streams/blob/master/SFTPStream.md#sftpstream-methods|SFTPStream methods}
 */
var mkdir = function (options) {
    var instance = this;

    var fnName = 'mkdir';

    var fnArgsCallback = function (resolve, reject) {
        var path = _.get(options, 'path');
        var attributes = _.get(options, 'attributes');

        var callback = function (err) {
            if (!_.isNil(err)) {
                return reject(err);
            }

            return resolve();
        };

        return [path, attributes, callback];
    };

    return instance._call(fnName, fnArgsCallback);

};

module.exports = mkdir;