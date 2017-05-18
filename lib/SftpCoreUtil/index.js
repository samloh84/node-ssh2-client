const _ = require('lodash');

/**
 * @class SftpCoreUtil
 * @param {SftpUtil} options
 */
var SftpCoreUtil = function (options) {
    var instance = this;

    const SFTPWrapper = require('ssh2/lib/SFTPWrapper');
    const Ssh2ClientUtil = require('../Ssh2ClientUtil');
    const SftpUtil = require('../SftpUtil');

    if (options instanceof SFTPWrapper) {
        instance._sftpUtil = new SftpUtil(options);
    } else if (options instanceof SftpUtil) {
        instance._sftpUtil = options;
    } else if (options instanceof Ssh2ClientUtil) {
        instance._ssh2ClientUtil = options;
    } else if (_.isPlainObject(options)) {
        instance._ssh2ClientUtil = new Ssh2ClientUtil(options);
    } else {
        throw new Error("Invalid parameter: options");
    }
};

SftpCoreUtil.constants = require('./constants');

_.assign(SftpCoreUtil.prototype, {
    _getSftpUtil: require('./_getSftpUtil'),
    _walk: require('./_walk'),
    chgrp: require('./chgrp'),
    chmod: require('./chmod'),
    chown: require('./chown'),
    constants: require('./constants'),
    cp: require('./cp'),
    ln: require('./ln'),
    ls: require('./ls'),
    mkdir: require('./mkdir'),
    mv: require('./mv'),
    rm: require('./rm')
});

module.exports = SftpCoreUtil;
