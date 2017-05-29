const Promise = require('bluebird');
const _path = require('path');
const _ = require('lodash');

/**
 * @memberOf SftpCoreUtil
 * @function cp
 *
 * @param {Object} options
 * @param {String|Buffer} options.source
 * @param {String|Buffer} options.destination
 * @param {Boolean} [options.recursive]
 * @param {Boolean} [options.archive]
 * @param {Boolean} [options.parents]
 * @returns {Promise<undefined>}
 *
 * @see {@link https://www.gnu.org/software/coreutils/manual/html_node/cp-invocation.html#cp-invocation}
 */
var cp = function (options) {
    const instance = this;
    return instance._getSftpClient()
        .then(function (sftpClient) {
            var source = _.get(options, 'source');
            var destination = _.get(options, 'destination');

            var recursive = _.get(options, 'recursive');
            var archive = _.get(options, 'archive');

            if (_.isString(source) || _.isBuffer(source)) {
                source = _path.resolve(process.cwd(), source);
            }

            if (_.isString(destination) || _.isBuffer(destination)) {
                destination = _path.resolve(process.cwd(), destination);
            }

            var copyFile = function (sourcePath, destinationPath) {
                return Promise.props({
                    sourceReadStream: sftpClient.createReadStream({path: sourcePath, flags: 'r'}),
                    destinationWriteStream: sftpClient.createWriteStream({path: destinationPath, flags: 'w'})
                })
                    .then(function (props) {
                        return new Promise(function (resolve, reject) {
                            var sourceReadStream = props.sourceReadStream;
                            var destinationWriteStream = props.destinationWriteStream;

                            sourceReadStream.on('error', function (err) {
                                return reject(err);
                            });

                            destinationWriteStream.on('error', function (err) {
                                return reject(err);
                            });

                            destinationWriteStream.on('finish', function () {
                                return resolve();
                            });

                            sourceReadStream.pipe(destinationWriteStream);
                        });
                    });
            };

            var stat = function (path) {
                return sftpClient.stat({path: path})
                    .catch(function (err) {
                        if (err.code !== 2) {
                            throw err;
                        }
                        return null;
                    });
            };

            var copyAttributes = function (destinationPath, sourcePathStats) {
                return sftpClient.setstat({
                    path: destinationPath,
                    attributes: {
                        atime: sourcePathStats.atime,
                        mtime: sourcePathStats.mtime,
                        mode: sourcePathStats.mode,
                        uid: sourcePathStats.uid,
                        gid: sourcePathStats.gid
                    }
                });
            };


            return Promise.props({
                sourceStats: stat(source),
                destinationStats: stat(destination)
            })
                .then(function (props) {
                    var sourceStats = props.sourceStats;
                    var destinationStats = props.destinationStats;

                    var sourceIsDirectory = sourceStats.isDirectory();
                    var destinationIsDirectory = !_.isNil(destinationStats) && destinationStats.isDirectory();


                    var performCopy = function (path, stats) {
                        var destinationPath;
                        if (destinationIsDirectory) {
                            destinationPath = _path.resolve(destination, _path.basename(source), _path.relative(source, path));
                        } else {
                            destinationPath = _path.resolve(destination, _path.relative(source, path));
                        }

                        var copyPromise;
                        if (stats.isDirectory()) {
                            copyPromise = instance.mkdir({path: destinationPath})
                        } else {
                            copyPromise = copyFile(path, destinationPath);
                        }

                        return copyPromise
                            .then(function () {
                                if (archive) {
                                    return copyAttributes(destinationPath, stats);
                                }
                            });
                    };

                    if (sourceIsDirectory) {
                        if (recursive) {
                            return instance._walk({
                                path: source,
                                stats: sourceStats,
                                recursive: recursive,
                                callback: performCopy,
                                includeBasePath: true
                            })
                        } else {
                            throw new Error("Cannot copy directory: " + source);
                        }
                    } else {
                        return performCopy(source, sourceStats);
                    }
                });
        });
};

module.exports = cp;
