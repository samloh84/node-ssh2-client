const _ = require('lodash');
const _fs = require('fs');
const _path = require('path');

var fs = {};

/**
 *
 * @param options
 * @param options.encoding
 * @param options.flag
 * @return {*}
 */
fs.readFile = function (options) {
    var path = _.get(options, 'path');
    var encoding = _.get(options, 'encoding', 'utf8');
    var flag = _.get(options, 'flag', 'r');
    path = _path.resolve(process.cwd(), path);
    return _fs.readFileSync(path, {encoding: encoding, flag: flag});
};

/**
 *
 * @param options
 * @param options.path
 * @param options.data
 * @param options.encoding
 * @param options.flag
 * @param options.mode
 * @return {*}
 */
fs.writeFile = function (options) {
    var path = _.get(options, 'path');
    path = _path.resolve(process.cwd(), path);

    var data = _.get(options, 'data');

    var encoding = _.get(options, 'encoding', 'utf8');
    var flag = _.get(options, 'flag', 'w+');
    var mode = _.get(options, 'mode');

    return _fs.writeFileSync(path, data, {encoding: encoding, flag: flag, mode: mode});
};

/**
 *
 * @param options
 * @param options.prefix
 */
fs.mkdtemp = function (options) {
    var prefix = _.get(options, 'prefix');
    prefix = _path.resolve(process.cwd(), prefix);
    return _fs.mkdtempSync(prefix);
};

/**
 *
 * @param options
 * @param options.path
 * @param options.recursive
 * @return {*}
 */
fs.mkdir = function (options) {
    var path = _.get(options, 'path');
    path = _path.resolve(process.cwd(), path);

    var recursive = _.get(options, 'recursive', true);
    var mode = _.get(options, 'mode');

    function mkdir(path, mode) {
        try {
            return _fs.mkdirSync(path, mode)
        } catch (err) {
            if (err.code !== 'EEXIST') {
                throw err;
            }
        }
    }

    if (recursive) {
        var root = _path.parse(path).root;
        var currentPath = path;
        var parentPaths = [];
        while (currentPath !== root) {
            parentPaths.unshift(currentPath);
            currentPath = _path.dirname(currentPath);
        }

        _.each(parentPaths, function (parentPath) {
            return mkdir(parentPath, mode);
        });
    }
    else {
        return mkdir(path, mode);
    }
};

/**
 *
 * @param options
 * @param options.recursive
 * @return {*}
 */
fs.rm = function (options) {
    var path = _.get(options, 'path');
    path = _path.resolve(process.cwd(), path);

    var recursive = _.get(options, 'recursive', true);

    function rm(path, stats) {
        try {
            if (_.isNil(stats)) {
                stats = _fs.statSync(path);
            }
            if (stats.isDirectory()) {
                return _fs.rmdirSync(path);
            } else {
                return _fs.unlinkSync(path);
            }
        } catch (err) {
            if (err.code !== 'NOENT') {
                throw err;
            }
        }
    }

    if (recursive) {
        var queue = [];

        function walk(path, stats) {
            if (_.isNil(stats)) {
                stats = _fs.statSync(path);
            }
            if (stats.isDirectory()) {
                _.each(_fs.readdirSync(path), function (child) {
                    var subpath = _path.resolve(path, child);
                    return walk(subpath);
                });
            }
            queue.push({path: path, stats: stats});
        }

        walk(path);

        return _.each(queue, function (pathInfo) {
            return rm(pathInfo.path, pathInfo.stats);
        });
    }
    else {
        return rm(path);
    }
};

module.exports = fs;