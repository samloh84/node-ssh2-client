/**
 * @memberOf SftpUtil#
 * @function getSftpCoreUtil
 *
 * @return {Promise<SftpCoreUtil>}
 */
const Promise = require('bluebird');
const _ = require('lodash');
const SftpCoreUtil = require("../SftpCoreUtil");


var getSftpCoreUtil = function (options) {
    var instance = this;
    var sftpCoreUtil = instance._sftpCoreUtil;

    if (!_.isNil(sftpCoreUtil)) {
        return Promise.resolve(sftpCoreUtil);
    } else {
        var _sftpCoreUtil = instance._sftpCoreUtil = new SftpCoreUtil(instance);
        return Promise.resolve(_sftpCoreUtil);
    }
};

module.exports = getSftpCoreUtil;