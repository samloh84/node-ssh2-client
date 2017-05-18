const Promise = require('bluebird');
const _ = require('lodash');

const SftpUtil = require('../SftpUtil');

/**
 * @memberOf Ssh2ClientUtil#
 * @function getSftpUtil
 *
 * @return {Promise<SftpUtil>}
 */
var getSftpUtil = function (options) {
    var instance = this;
    var sftpUtil = instance._sftpUtil;


    if (!_.isNil(sftpUtil)) {
        return Promise.resolve(sftpUtil);
    } else {
        return instance.sftp()
            .then(function (sftpWrapper) {
                var sftpUtil = instance._sftpUtil = new SftpUtil(sftpWrapper);
                return sftpUtil;
            });
    }
};

module.exports = getSftpUtil;