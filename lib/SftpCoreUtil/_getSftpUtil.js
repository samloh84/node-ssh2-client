const Promise = require('bluebird');
const _ = require('lodash');

/**
 * @memberOf SftpCoreUtil#
 * @function _getSftpUtil
 *
 * @return {Promise<SFTPWrapper>}
 * @private
 */
var _getSftpUtil = function () {
    var instance = this;

    var ssh2ClientUtil = instance._ssh2ClientUtil;
    var sftpUtil = instance._sftpUtil;

    var sftpUtilPromise;
    if (_.isNil(sftpUtil)) {
        sftpUtilPromise = ssh2ClientUtil.getSftpUtil()
            .tap(function (sftpWrapper) {
                instance._sftpWrapper = sftpWrapper;
            });
    } else {
        sftpUtilPromise = Promise.resolve(sftpUtil)
    }

    return sftpUtilPromise;
};

module.exports = _getSftpUtil;