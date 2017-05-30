const _ = require('lodash');

/**
 * @class SftpCoreUtil
 * @param {SftpClient} options
 */
var SftpCoreUtil = function (options) {
    var instance = this;

    const SFTPWrapper = require('ssh2/lib/SFTPWrapper');
    const Ssh2Client = require('../Ssh2Client');
    const SftpClient = require('../SftpClient');

    if (options instanceof SFTPWrapper) {
        instance._sftpClient = new SftpClient(options);
    } else if (options instanceof SftpClient) {
        instance._sftpClient = options;
    } else if (options instanceof Ssh2Client) {
        instance._ssh2Client = options;
    } else if (_.isPlainObject(options)) {
        instance._ssh2Client = new Ssh2Client(options);
    } else {
        throw new Error("Invalid parameter: options");
    }
};

SftpCoreUtil.constants = require('./constants');

_.assign(SftpCoreUtil.prototype, {
    _getSftpClient: require('./_getSftpClient'),
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
