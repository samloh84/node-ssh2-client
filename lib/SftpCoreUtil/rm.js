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
    return instance._getSftpUtil()
        .then(function (sftpUtil) {
            var path = _.get(options, 'path');
            var encoding = _.get(options, 'encoding');
            var recursive = _.get(options, 'recursive');

            if (_.isString(path) || _.isBuffer(path)) {
                path = _path.resolve(process.cwd(), path);
            }

            return sftpUtil.stat({path: path})
                .then(function (stats) {
                    var isDirectory = stats.isDirectory();

                    if (isDirectory) {
                        if (recursive) {

                            return instance.ls({path: path, encoding: encoding, recursive: true})
                                .then(function (files) {
                                    files = files.reverse();
                                    return Promise.each(files, function (fileObject) {
                                        var filePath = fileObject.path;
                                        var fileStats = fileObject.stats;
                                        if (fileStats.isDirectory()) {
                                            return sftpUtil.rmdir({path: filePath});
                                        } else if (fileStats.isFile()) {
                                            return sftpUtil.unlink({path: filePath});
                                        } else {
                                            return Promise.resolve();
                                        }
                                    });
                                });
                        } else {
                            throw new Error("Cannot remove directory " + path);
                        }
                    } else {
                        return sftpUtil.unlink({path: path});
                    }
                });
        })


};

module.exports = rm;

