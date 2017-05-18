const _ = require('lodash');
const _path = require('path');

/**
 * @memberOf SftpCoreUtil
 * @function ln
 *
 * @param options
 * @param options.source
 * @param options.destination
 * @param options.symbolic
 *
 * @returns {*}
 * @see {@link https://www.gnu.org/software/coreutils/manual/html_node/ln-invocation.html#ln-invocation}
 */
var ln = function (options) {
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

            var symbolic = _.get(options, 'symbolic');

            var link = function (sourcePath, destinationPath) {
                var destinationParentPath = _path.dirname(destinationPath);
                return instance.mkdir({path: destinationParentPath, parents: true})
                    .catch(function (err) {
                        if (err.code !== 'EEXIST' && err.code !== 17) {
                            throw err;
                        }
                    })
                    .then(function () {
                        if (symbolic) {
                            return sftpUtil.symlink({targetPath: sourcePath, linkPath: destinationPath});
                        } else {
                            return sftpUtil.ext_openssh_hardlink({targetPath: sourcePath, linkPath: destinationPath});
                        }
                    });
            };

            return sftpUtil.stat({path: destination})
                .catch(function (err) {
                    if (err.code !== 'ENOENT' && err.code !== 2) {
                        throw err;
                    }
                })
                .then(function (destinationStats) {
                    var destinationIsDirectory = !_.isNil(destinationStats) && destinationStats.isDirectory();

                    var destinationPath;
                    if (destinationIsDirectory) {
                        destinationPath = _path.resolve(destination, _path.basename(source));
                    } else {
                        destinationPath = destination;
                    }

                    return link(source, destinationPath);
                });

        });

};

module.exports = ln;
