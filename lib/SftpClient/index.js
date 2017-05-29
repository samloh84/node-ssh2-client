const _ = require('lodash');

/**
 * @class SftpClient
 * @param options
 */
var SftpClient = function (options) {
    var instance = this;

    const SFTPWrapper = require('ssh2/lib/SFTPWrapper');
    const Ssh2Client = require('../Ssh2Client');

    if (options instanceof SFTPWrapper) {
        instance._sftpWrapper = options;
    } else if (options instanceof Ssh2Client) {
        instance._ssh2Client = options;
    } else if (_.isPlainObject(options)) {
        instance._ssh2Client = new Ssh2Client(options);
    } else {
        throw new Error("Invalid parameter: options");
    }
};

SftpClient.constants = require('./constants');

_.assign(SftpClient.prototype, {
    _call: require('./_call'),
    _getSftpWrapper: require('./_getSftpWrapper'),
    chmod: require('./chmod'),
    chown: require('./chown'),
    close: require('./close'),
    constants: require('./constants'),
    createReadStream: require('./createReadStream'),
    createWriteStream: require('./createWriteStream'),
    ext_openssh_fsync: require('./ext_openssh_fsync'),
    ext_openssh_hardlink: require('./ext_openssh_hardlink'),
    ext_openssh_rename: require('./ext_openssh_rename'),
    ext_openssh_statvfs: require('./ext_openssh_statvfs'),
    fastGet: require('./fastGet'),
    fastPut: require('./fastPut'),
    fchmod: require('./fchmod'),
    fchown: require('./fchown'),
    fsetstat: require('./fsetstat'),
    fstat: require('./fstat'),
    futimes: require('./futimes'),
    getSftpCoreUtil: require('./getSftpCoreUtil'),
    index: require('./index'),
    lstat: require('./lstat'),
    mkdir: require('./mkdir'),
    open: require('./open'),
    opendir: require('./opendir'),
    read: require('./read'),
    readdir: require('./readdir'),
    readlink: require('./readlink'),
    realpath: require('./realpath'),
    rename: require('./rename'),
    rmdir: require('./rmdir'),
    stat: require('./stat'),
    symlink: require('./symlink'),
    unlink: require('./unlink'),
    utimes: require('./utimes'),
    write: require('./write')
});

module.exports = SftpClient;
