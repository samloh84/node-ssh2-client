const _ = require('lodash');
const fs = require('fs');

/**
 *  @memberOf SftpClient#
 *  @name constants
 */
var constants = _.merge({}, fs.constants, {
    S_ISUID: parseInt(4000, 8),
    S_ISGID: parseInt(2000, 8),
    S_ISVTX: parseInt(1000, 8),
    S_IRWXU: parseInt(700, 8),
    S_IRUSR: parseInt(400, 8),
    S_IWUSR: parseInt(200, 8),
    S_IXUSR: parseInt(100, 8),
    S_IRWXG: parseInt(70, 8),
    S_IRGRP: parseInt(40, 8),
    S_IWGRP: parseInt(20, 8),
    S_IXGRP: parseInt(10, 8),
    S_IRWXO: parseInt(7, 8),
    S_IROTH: parseInt(4, 8),
    S_IWOTH: parseInt(2, 8),
    S_IXOTH: parseInt(1, 8),
    S_IRUGO: parseInt(444, 8),
    S_IWUGO: parseInt(222, 8),
    S_IXUGO: parseInt(111, 8)
});

module.exports = constants;