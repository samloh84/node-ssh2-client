const Promise = require('bluebird');
const _ = require('lodash');

/**
 * @memberOf SftpUtil#
 * @function _getSftpWrapper
 *
 * @return {Promise<SFTPWrapper>}
 * @private
 */
var _getSftpWrapper = function () {
    var instance = this;

    var ssh2ClientUtil = instance._ssh2ClientUtil;
    var sftpWrapper = instance._sftpWrapper;

    var sftpWrapperPromise;
    if (_.isNil(sftpWrapper)) {
        sftpWrapperPromise = ssh2ClientUtil.sftp()
            .tap(function (sftpWrapper) {
                instance._sftpWrapper = sftpWrapper;
            });
    } else {
        sftpWrapperPromise = Promise.resolve(sftpWrapper)
    }

    return sftpWrapperPromise;
};

module.exports = _getSftpWrapper;