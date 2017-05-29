const _ = require('lodash');
const Promise = require('bluebird');
const _path = require('path');
const ModeUtil = require('../ModeUtil');

const constants = require('./constants');

/**
 * @memberOf SftpCoreUtil
 * @function chmod
 *
 * @param {Object} options
 * @param {String|Buffer} options.path
 * @param {String} [options.encoding=utf8]
 * @param {Boolean} options.recursive
 * @param {String|Number} options.mode
 * @returns {Promise<undefined>}
 * @see {@link https://www.gnu.org/software/coreutils/manual/html_node/chmod-invocation.html#chmod-invocation}
 */
var chmod = function (options) {
    const instance = this;
    return instance._getSftpClient()
        .then(function (sftpClient) {
            var path = _.get(options, 'path');
            var encoding = _.get(options, 'encoding');
            var recursive = _.get(options, 'recursive');
            var mode = _.get(options, 'mode');

            if (_.isString(path) || _.isBuffer(path)) {
                path = _path.resolve(process.cwd(), path);
            }
            var root = _path.parse(path).root;

            if (path === root) {
                throw new Error("Cannot chmod root directory: " + root);
            }

            var modeOperations = ModeUtil.parseMode(mode);

            function performChmod(filePath, fileStats) {
                if (_.isNil(fileStats)) {
                    fileStats = sftpClient.stat({path: filePath});
                }

                return Promise.resolve(fileStats)
                    .then(function (fileStats) {
                        var newMode = ModeUtil.processModeOperations(fileStats, modeOperations);
                        return sftpClient.chmod({path: filePath, mode: newMode});
                    })
                    .return({path: filePath, stats: fileStats});
            }


            return instance._walk({
                path: path,
                encoding: encoding,
                recursive: recursive,
                includeBasePath: true,
                callback: performChmod
            });
        });

};

module.exports = chmod;