const _ = require('lodash');

/**
 * @memberOf SftpCoreUtil
 * @function chgrp
 *
 * @param {Object} options
 * @param {String|Buffer} options.path
 * @param {Number} options.gid
 * @returns {Promise<undefined>}
 *
 * @see {@link https://www.gnu.org/software/coreutils/manual/html_node/chgrp-invocation.html#chgrp-invocation}
 */
var chgrp = function (options) {
    const instance = this;

    var path = _.get(options, 'path');
    var recursive = _.get(options, 'recursive');
    var gid = _.get(options, 'gid');

    return instance.chown({path: path, recursive: recursive, gid: gid});
};

module.exports = chgrp;