const Promise = require('bluebird');
const _ = require('lodash');
const _path = require('path');

/**
 * @memberOf SftpCoreUtil
 * @function _walk
 *
 * @param {Object} options
 * @param {String|Buffer} options.path
 * @param {fs.Stats} [options.stats]
 * @param {String} [options.encoding]
 * @param {_walkCallback} options.callback
 * @param {Boolean} [options.includeBasePath]
 * @returns {Promise<undefined>}
 * @private
 */
var _walk = function (options) {
    const instance = this;

    return instance._getSftpClient()
        .then(function (sftpClient) {

            var path = _.get(options, 'path', '.');
            var stats = _.get(options, 'stats');

            if (_.isString(path) || _.isBuffer(path)) {
                path = _path.resolve(process.cwd(), path);
            }

            var encoding = _.get(options, 'encoding');

            var recursive = _.get(options, 'recursive', false);
            var includeBasePath = _.get(options, 'includeBasePath', false);

            /**
             *
             * @callback _walkCallback
             * @param {String|Buffer} path
             * @param {fs.Stats} stats
             */
            var callback = _.get(options, 'callback');

            function visit(path, stats) {
                if (_.isNil(stats)) {
                    stats = sftpClient.stat({path: path});
                }

                return Promise.resolve(stats)
                    .then(function (stats) {
                        if (stats.isDirectory()) {
                            return sftpClient.readdir({location: path})
                                .then(function (files) {
                                    return Promise.map(files, function (file) {
                                        var filePath = _path.resolve(path, file.filename);

                                        return sftpClient.stat({path: filePath})
                                            .then(function (fileStats) {
                                                return {path: filePath, stats: fileStats};
                                            });
                                    })
                                        .then(function (files) {
                                            return Promise.each(files, function (file) {
                                                return Promise.resolve(callback(file.path, file.stats));
                                            })
                                                .then(function () {
                                                    if (recursive) {
                                                        return Promise.each(files, function (file) {
                                                            if (file.stats.isDirectory()) {
                                                                return visit(file.path, file.stats);
                                                            }
                                                        })
                                                    }
                                                });

                                        });
                                });
                        } else {
                            return Promise.resolve(callback(path, stats));
                        }

                    });
            }


            if (_.isNil(stats)) {
                stats = sftpClient.stat({path: path});
            }

            return Promise.resolve(stats)
                .then(function (stats) {
                    if (stats.isDirectory()) {
                        var processBasePath;
                        if (includeBasePath) {
                            processBasePath = Promise.resolve(callback(path, stats));
                        } else {
                            processBasePath = Promise.resolve();
                        }
                        return processBasePath
                            .then(function () {
                                return visit(path, stats);
                            });
                    } else {
                        return Promise.resolve(callback(path, stats));
                    }
                });
        });

};

module.exports = _walk;