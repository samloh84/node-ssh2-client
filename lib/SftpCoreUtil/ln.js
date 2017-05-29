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
    return instance._getSftpClient()
        .then(function (sftpClient) {
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
                if (symbolic) {
                    return sftpClient.symlink({targetPath: sourcePath, linkPath: destinationPath});
                } else {
                    return sftpClient.ext_openssh_hardlink({targetPath: sourcePath, linkPath: destinationPath});
                }
            };

            return sftpClient.stat({path: destination})
                .catch(function (err) {
                    if (err.code !== 2) {
                        throw err;
                    }
                    return null;
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
