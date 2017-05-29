const Promise = require('bluebird');
const _ = require('lodash');


/**
 * @memberOf Ssh2Client#
 * @function getSftpClient
 *
 * @return {Promise<SftpClient>}
 */
var getSftpClient = function (options) {
    var instance = this;
    var sftpClient = instance._sftpClient;


    if (!_.isNil(sftpClient)) {
        return Promise.resolve(sftpClient);
    } else {
        return instance.sftp()
            .then(function (sftpWrapper) {
                const SftpClient = require('../SftpClient');
                sftpClient = instance._sftpClient = new SftpClient(sftpWrapper);
                return sftpClient;
            });
    }
};

module.exports = getSftpClient;