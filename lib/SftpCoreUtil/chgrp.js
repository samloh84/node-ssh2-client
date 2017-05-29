const _ = require('lodash');
const Promise = require('bluebird');
const _path = require('path');

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
    return instance._getSftpClient()
        .then(function (sftpClient) {
            var path = _.get(options, 'path');
            var recursive = _.get(options, 'recursive');
            var encoding = _.get(options, 'encoding');
            var gid = _.get(options, 'gid');

            if (_.isString(path) || _.isBuffer(path)) {
                path = _path.resolve(process.cwd(), path);
            }
            var root = _path.parse(path).root;

            if (path === root) {
                throw new Error("Cannot chgrp root directory: " + root);
            }

            function performChown(filePath, fileStats) {
                if (_.isNil(fileStats)) {
                    fileStats = sftpClient.stat({path: filePath});
                }

                return Promise.resolve(fileStats)
                    .then(function (fileStats) {
                        var newGid = _.isNil(gid) ? fileStats.gid : gid;
                        return sftpClient.chown({path: filePath, uid: fileStats.uid , gid: newGid});
                    });
            }

            return instance._walk({
                path: path,
                encoding: encoding,
                recursive: recursive,
                includeBasePath: true,
                callback: performChown
            });
        });
};

module.exports = chgrp;