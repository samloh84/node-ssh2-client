const _ = require('lodash');


/**
 * @memberOf Ssh2Client#
 * @function sftp
 *
 * @return {Promise<SFTPWrapper>}
 */
var sftp = function () {
    var instance = this;

    var fnName = 'sftp';

    var fnArgsCallback = function (resolve, reject) {

        var callback = function (err, sftp) {
            if (!_.isNil(err)) {
                return reject(err);
            }

            return resolve(sftp);
        };


        return [callback];
    };

    return instance._call(fnName, fnArgsCallback);
};

module.exports = sftp;