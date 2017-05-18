const _ = require('lodash');
const _path = require('path');


/**
 * @memberOf SftpCoreUtil
 * @function mv
 *
 * @param options
 * @param options.source
 * @param options.destination
 *
 * @returns {*}
 * @see {@link https://www.gnu.org/software/coreutils/manual/html_node/mv-invocation.html#mv-invocation}
 */
var mv = function (options) {


    const instance = this;
    return instance._getSftpUtil()
        .then(function (sftpUtil) {
            var source = _.get(options, 'source');
            var destination = _.get(options, 'destination');
            var encoding = _.get(options, 'encoding');

            if (_.isString(source) || _.isBuffer(source)) {
                source = _path.resolve(process.cwd(), source);
            }

            if (_.isString(destination) || _.isBuffer(destination)) {
                destination = _path.resolve(process.cwd(), destination);
            }

            var move = function (sourcePath, destinationPath) {
                var destinationParentPath = _path.dirname(destinationPath);
                return instance.mkdir({path: destinationParentPath, parents: true})
                    .catch(function (err) {
                        if (err.code !== 'EEXIST' && err.code !== 17) {
                            throw err;
                        }
                    })
                    .then(function () {
                        return sftpUtil.rename({srcPath: sourcePath, destPath: destinationPath});
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

                    return move(source, destinationPath);
                });

        });

};

module.exports = mv;
