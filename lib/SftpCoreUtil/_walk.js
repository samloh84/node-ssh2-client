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
 * @returns {Promise<undefined>}
 * @private
 */
var _walk = function (options) {
    const instance = this;

    return instance._getSftpUtil()
        .then(function (sftpUtil) {

            var path = _.get(options, 'path', '.');
            var stats = _.get(options, 'stats');

            if (_.isString(path) || _.isBuffer(path)) {
                path = _path.resolve(process.cwd(), path);
            }

            var encoding = _.get(options, 'encoding');

            var recursive = _.get(options, 'recursive');

            /**
             *
             * @callback _walkCallback
             * @param {String|Buffer} path
             * @param {fs.Stats} stats
             */
            var callback = _.get(options, 'callback');

            function visit(currentPath, currentPathStats) {
                var currentPathStatsPromise;
                if (_.isNil(currentPathStats)) {
                    currentPathStatsPromise = sftpUtil.stat({path: currentPath});
                } else {
                    currentPathStatsPromise = Promise.resolve(currentPathStats);
                }

                return currentPathStatsPromise
                    .then(function (currentPathStats) {
                        if (currentPathStats.isDirectory()) {
                            return sftpUtil.readdir({location: currentPath, encoding: encoding})
                                .then(function (files) {
                                    return Promise.each(files, function (fileData) {
                                        var filePath = _path.resolve(currentPath, fileData.filename);
                                        return sftpUtil.stat({path: filePath})
                                            .then(function (fileStats) {
                                                return Promise.resolve(callback(filePath, fileStats))
                                                    .then(function () {
                                                        if (fileStats.isDirectory() && recursive) {
                                                            return visit(filePath, fileStats);
                                                        }
                                                    });
                                            });
                                    });
                                });
                        } else {
                            return Promise.resolve(callback(currentPath, currentPathStats));
                        }
                    });
            }

            return visit(path, stats);
        });

};

module.exports = _walk;