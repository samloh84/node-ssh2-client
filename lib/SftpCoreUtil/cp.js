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
    return instance._getSftpUtil()
        .then(function (sftpUtil) {
            var source = _.get(options, 'source');
            var destination = _.get(options, 'destination');

            if (_.isString(source) || _.isBuffer(source)) {
                source = _path.resolve(process.cwd(), source);
            }

            if (_.isString(destination) || _.isBuffer(destination)) {
                destination = _path.resolve(process.cwd(), destination);
            }

            var encoding = _.get(options, 'encoding');
            var recursive = _.get(options, 'recursive');
            var archive = _.get(options, 'archive');

            var copy = function (sourcePath, destinationPath) {
                var destinationParentPath = _path.dirname(destinationPath);
                return instance.mkdir({path: destinationParentPath, parents: true})
                    .catch(function (err) {
                        if (err.code !== 'EEXIST' && err.code !== 17) {
                            throw err;
                        }
                    })
                    .then(function () {
                        return Promise.props({
                            sourceReadStream: sftpUtil.createReadStream({path: sourcePath, flags: 'r'}),
                            destinationWriteStream: sftpUtil.createWriteStream({path: destinationPath, flags: 'w'})
                        })
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

            var copyAttributes = function (destinationPath, sourcePathStats) {
                return sftpUtil.setstat({
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
                sourceStats: sftpUtil.stat({path: source}),
                destinationStats: sftpUtil.stat({path: destination})
                    .catch(function (err) {
                        if (err.code !== 'ENOENT' && err.code !== 2) {
                            throw err;
                        }
                    })
            })
                .then(function (props) {
                    var sourceStats = props.sourceStats;
                    var destinationStats = props.destinationStats;

                    var sourceIsDirectory = sourceStats.isDirectory();
                    var destinationIsDirectory = !_.isNil(destinationStats) && destinationStats.isDirectory();

                    if (sourceIsDirectory) {
                        if (recursive) {
                            var callback = function (path, stats) {
                                var destinationPath = _path.resolve(destination, _path.relative(source, path));

                                var copyPromise;
                                if (stats.isFile()) {
                                    copyPromise = copy(path, destinationPath);
                                } else if (stats.isDirectory()) {
                                    copyPromise = instance.mkdir({path: destinationPath, parents: true})
                                        .catch(function (err) {
                                            if (err.code !== 'EEXIST' && err.code!== 17) {
                                                throw err;
                                            }
                                        });
                                } else {
                                    copyPromise = Promise.resolve();
                                }

                                return copyPromise
                                    .then(function () {
                                        if (archive) {
                                            return copyAttributes(destinationPath, stats);
                                        }
                                    });
                            };

                            return instance._walk({
                                path: source,
                                stats: sourceStats,
                                encoding: encoding,
                                recursive: true,
                                callback: callback
                            });
                        } else {
                            throw new Error("Cannot copy directory: " + source);
                        }
                    } else {
                        var destinationPath;
                        if (destinationIsDirectory) {
                            destinationPath = _path.resolve(destination, _path.basename(source));
                        } else {
                            destinationPath = destination;
                        }

                        return copy(source, destinationPath)
                            .then(function () {
                                if (archive) {
                                    return copyAttributes(destinationPath, sourceStats);
                                }
                            })
                    }
                });

        });

};

module.exports = cp;
