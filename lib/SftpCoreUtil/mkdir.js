const Promise = require('bluebird');
const _ = require('lodash');
const _path = require('path');

/**
 * @memberOf SftpCoreUtil
 * @function mkdir
 *
 * @param options
 * @param options.path
 * @param options.parents
 * @param options.mode
 * @returns {undefined}
 * @see {@link https://www.gnu.org/software/coreutils/manual/html_node/mkdir-invocation.html#mkdir-invocation}
 */
var mkdir = function (options) {
    const instance = this;

    return instance._getSftpUtil()
        .then(function (sftpUtil) {
            var path = _.get(options, 'path');
            var parents = _.get(options, 'parents');
            var mode = _.get(options, 'mode');

            if (_.isString(path) || _.isBuffer(path)) {
                path = _path.resolve(process.cwd(), path);
            }

            var mkdirParentsPromise;

            if (parents) {
                var root = _path.parse(path).root;
                var currentPath = path;
                var paths = [];
                while (currentPath !== root) {
                    paths.unshift(currentPath);
                    currentPath = _path.dirname(currentPath);
                }

                return Promise.each(paths, function (path) {
                    return sftpUtil.mkdir({path: path, mode: mode})
                        .catch(function (err) {
                            if (err.code === 'EEXIST' || err.code === 17) {
                                return null;
                            } else if (err.code === 4) {
                                return sftpUtil.stat({path: path})
                                    .catch(function (statErr) {
                                        if (statErr.code === 'ENOENT' || err.code === 2) {
                                            throw err;
                                        } else {
                                            return null;
                                        }
                                    })
                            } else {
                                throw err;
                            }
                        });
                });
            } else {
                return sftpUtil.mkdir({path: path, mode: mode});
            }
        });

};

module.exports = mkdir;
