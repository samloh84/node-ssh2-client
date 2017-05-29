const Promise = require('bluebird');
const _ = require('lodash');

/**
 * @memberOf SftpCoreUtil#
 * @function _getSftpClient
 *
 * @return {Promise<SFTPWrapper>}
 * @private
 */
var _getSftpClient = function () {
    var instance = this;

    var ssh2Client = instance._ssh2Client;
    var sftpClient = instance._sftpClient;

    var sftpClientPromise;
    if (_.isNil(sftpClient)) {
        sftpClientPromise = ssh2Client.getSftpClient()
            .tap(function (sftpClient) {
                instance._sftpClient = sftpClient;
            });
    } else {
        sftpClientPromise = Promise.resolve(sftpClient)
    }

    return sftpClientPromise;
};

module.exports = _getSftpClient;