const _ = require('lodash');

/**
 * @memberOf SftpClient#
 * @function setstat
 *
 * @param options
 * @param {Buffer} options.path
 * @param {Object} options.attributes
 *
 * @return {Promise<undefined>}
 * @see {@link https://github.com/mscdex/ssh2-streams/blob/master/SFTPStream.md#sftpstream-methods|SFTPStream methods}
 */
var setstat = function (options) {
    var instance = this;

    var fnName = 'setstat';

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

module.exports = setstat;