const _ = require('lodash');
const Promise = require('bluebird');
const _path = require('path');

/**
 * @memberOf SftpCoreUtil
 * @function chown
 *
 * @param {Object} options
 * @param {String|Buffer} options.path
 * @param {String} [options.encoding=utf8]
 * @param {Boolean} options.recursive
 * @param {String|Number} options.uid
 * @param {String|Number} options.gid
 * @returns {Promise<undefined>}
 *
 * @see {@link https://www.gnu.org/software/coreutils/manual/html_node/chown-invocation.html#chown-invocation}
 */
var chown = function (options) {

    const instance = this;
    return instance._getSftpClient()
        .then(function (sftpClient) {
            var path = _.get(options, 'path');
            var recursive = _.get(options, 'recursive');
            var encoding = _.get(options, 'encoding');
            var uid = _.get(options, 'uid');
            var gid = _.get(options, 'gid');

            if (_.isString(path) || _.isBuffer(path)) {
                path = _path.resolve(process.cwd(), path);
            }
            var root = _path.parse(path).root;

            if (path === root) {
                throw new Error("Cannot chown root directory: " + root);
            }

            function performChown(filePath, fileStats) {
                if (_.isNil(fileStats)) {
                    fileStats = sftpClient.stat({path: filePath});
                }

                return Promise.resolve(fileStats)
                    .then(function (fileStats) {
                        var newUid = _.isNil(uid) ? fileStats.uid : uid;
                        var newGid = _.isNil(gid) ? fileStats.gid : gid;
                        return sftpClient.chown({path: filePath, uid: newUid, gid: newGid});
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

module.exports = chown;