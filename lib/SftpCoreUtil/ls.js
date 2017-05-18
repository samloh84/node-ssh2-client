const _ = require('lodash');
const _path = require('path');

/**
 * @memberOf SftpCoreUtil
 * @function ls
 *
 * @param options
 * @param options.path
 * @param options.encoding
 * @param options.recursive
 * @returns {*}
 * @see {@link https://www.gnu.org/software/coreutils/manual/html_node/ls-invocation.html#ls-invocation}
 */
var ls = function (options) {
    const instance = this;

    var path = _.get(options, 'path', '.');


    if (_.isString(path) || _.isBuffer(path)) {
        path = _path.resolve(process.cwd(), path);
    }

    var encoding = _.get(options, 'encoding');
    var recursive = _.get(options, 'recursive');

    var files = [];

    var callback = function (path, stats) {
        files.push({path: path, stats: stats});
    };

    return instance._walk({path: path, encoding: encoding, recursive: recursive, callback: callback})
        .then(function () {
            return files;
        })
};

module.exports = ls;
