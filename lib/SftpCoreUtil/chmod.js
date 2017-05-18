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
    return instance._getSftpUtil()
        .then(function (sftpUtil) {
            try {

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

                function callback(filePath, fileStats) {
                    var fileStatsPromise;
                    if (_.isNil(fileStats)) {
                        fileStatsPromise = sftpUtil.stat({path: path});
                    } else {
                        fileStatsPromise = Promise.resolve(fileStats);
                    }

                    return fileStatsPromise
                        .then(function (fileStats) {
                            var newMode = ModeUtil.processModeOperations(fileStats, modeOperations);
                            return sftpUtil.chmod({path: filePath, mode: newMode});
                        });
                }

                if (recursive) {
                    return instance._walk({path: path, encoding: encoding, recursive: recursive, callback: callback})
                } else {
                    return callback(path);
                }

            } catch (err) {
                return Promise.reject(err);
            }
        })

};

module.exports = chmod;