const Promise = require('bluebird');
const _ = require('lodash');
const _path = require('path');

/**
 * @memberOf SftpCoreUtil
 * @function rm
 *
 * @param options
 * @param options.path
 * @param options.recursive
 *
 * @returns {*}
 * @see {@link https://www.gnu.org/software/coreutils/manual/html_node/rm-invocation.html#rm-invocation}
 */
var rm = function (options) {
    const instance = this;
    return instance._getSftpClient()
        .then(function (sftpClient) {
            var path = _.get(options, 'path');
            var encoding = _.get(options, 'encoding');
            var recursive = _.get(options, 'recursive');

            if (_.isString(path) || _.isBuffer(path)) {
                path = _path.resolve(process.cwd(), path);
            }
            var root = _path.parse(path).root;

            if (path === root) {
                throw new Error("Cannot rm root directory: " + root);
            }

            var files = [];

            var callback = function (filePath, fileStats) {
                if (_.isNil(fileStats)) {
                    fileStats = sftpClient.stat({path: filePath});
                }

                return Promise.resolve(fileStats)
                    .then(function (fileStats) {
                        files.unshift({path: filePath, stats: fileStats});
                    });
            };

            return instance._walk({
                path: path,
                encoding: encoding,
                recursive: recursive,
                includeBasePath: true,
                callback: callback
            })
                .then(function () {
                    return Promise.each(files, function (fileObject) {
                        var filePath = fileObject.path;
                        var fileStats = fileObject.stats;
                        if (fileStats.isDirectory()) {
                            return sftpClient.rmdir({path: filePath});
                        } else {
                            return sftpClient.unlink({path: filePath});
                        }
                    });
                });
        });
};

module.exports = rm;

