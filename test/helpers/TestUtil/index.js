const fs = require('./fs');
const _ = require('lodash');
const _fs = require('fs');
const _path = require('path');
const random = require('./random');
const Ssh2Client = require('../../../lib/Ssh2Client/index');
const SftpClient = require('../../../lib/SftpClient/index');
const SftpCoreUtil = require('../../../lib/SftpCoreUtil/index');

const HOSTNAME = _.get(process.env, 'env.HOSTNAME', 'localhost');
const PORT = _.get(process.env, 'SSH2_CLIENT_TEST_PORT', 22);
const USERNAME = _.get(process.env, 'SSH2_CLIENT_TEST_USERNAME', 'vagrant');
const PASSWORD = _.get(process.env, 'SSH2_CLIENT_TEST_PASSWORD', 'vagrant');
const PRIVATE_KEY = _.get(process.env, 'SSH2_CLIENT_TEST_PRIVATE_KEY');
const PASSPHRASE = _.get(process.env, 'SSH2_CLIENT_TEST_PASSPHRASE');
const TEMP_DIR_PREFIX = _path.resolve(_.get(process.env, 'SSH2_CLIENT_TEST_TEMP_DIR_PREFIX', '/tmp/ssh2-client-test-'));
const TEMP_DIR_ROOT = _.get(process.env, 'SSH2_CLIENT_TEST_TEMP_DIR_ROOT');

var TestUtil = {};

TestUtil.config = {
    ssh2: {
        hostname: HOSTNAME,
        username: USERNAME,
        password: PASSWORD,
        privateKey: PRIVATE_KEY,
        passphrase: PASSPHRASE
    },
    tempDirPrefix: TEMP_DIR_PREFIX,
    tempDirRoot: TEMP_DIR_ROOT
};

if (_.isNil(TestUtil.config.tempDirRoot)) {
    TestUtil.config.tempDirRoot = fs.mkdtemp({prefix: TEMP_DIR_PREFIX});
}

TestUtil.fs = fs;
TestUtil.random = random;

TestUtil.getSsh2ClientConfig = function () {
    var options = {
        host: HOSTNAME,
        port: PORT,
        username: USERNAME,
        password: PASSWORD,
        privateKey: PRIVATE_KEY,
        passphrase: PASSPHRASE
    };

    if (!_.isNil(options.privateKey)) {
        options.privateKey = fs.readFile({path: options.privateKey});
    }
    return options;
}

TestUtil.createSsh2Client = function () {
    var options = TestUtil.getSsh2ClientConfig();
    return new Ssh2Client(options);
};

TestUtil.createSftpClient = function () {
    var options = TestUtil.getSsh2ClientConfig();
    return new SftpClient(options);
};

TestUtil.createSftpCoreUtil = function () {
    var options = TestUtil.getSsh2ClientConfig();
    return new SftpCoreUtil(options);
};

/**
 *
 * @param options
 * @param [options.path]
 * @param [options.parent]
 * @param [options.name]
 * @param [options.mode]
 * @param [options.nameLength]
 * @return {{path: *, name: *, mode: *}}
 */
TestUtil.createDirectory = function (options) {
    var path = _.get(options, 'path');
    var parent = _.get(options, 'parent');
    var name = _.get(options, 'name');
    var mode = _.get(options, 'mode', parseInt('700', 8));
    var nameLength = _.get(options, 'nameLength', 10);

    if (!_.isNil(path)) {
        var pathInfo = _path.parse(path);
        name = pathInfo.base;
        parent = pathInfo.dir;
    } else {
        if (_.isNil(parent)) {
            parent = TestUtil.config.tempDirRoot;
        }
        if (_.isNil(name)) {
            name = random.getString(nameLength);
        }

        path = _path.resolve(parent, name);
    }

    fs.mkdir({path: path, mode: mode});

    return {parent: parent, path: path, name: name, mode: mode, type: 'dir'};
};

/**
 *
 * @param options
 * @param [options.path]
 * @param [options.parent]
 * @param [options.name]
 * @param [options.data]
 * @param [options.mode]
 * @param [options.nameLength]
 * @param [options.dataLength]
 * @return {{parent: *, name: *, path: *, data: *, mode: *}}
 */
TestUtil.generateRandomFile = function (options) {
    var path = _.get(options, 'path');
    var parent = _.get(options, 'parent');
    var name = _.get(options, 'name');
    var data = _.get(options, 'data');
    var mode = _.get(options, 'mode', parseInt('700', 8));
    var nameLength = _.get(options, 'nameLength', 10);
    var dataLength = _.get(options, 'dataLength', 10);

    if (!_.isNil(path)) {
        var pathInfo = _path.parse(path);
        name = pathInfo.base;
        parent = pathInfo.dir;
    } else {
        if (_.isNil(parent)) {
            var dirInfo = TestUtil.createDirectory({mode: mode, nameLength: nameLength});
            parent = dirInfo.path;
        }

        if (_.isNil(name)) {
            name = random.getString(nameLength);
        }
        path = _path.resolve(parent, name);
    }

    if (_.isNil(data)) {
        data = random.getString(dataLength);
    }

    fs.writeFile({path: path, data: data, mode: mode});
    return {parent: parent, path: path, name: name, data: data, mode: mode, type: 'file'};
};

/**
 *
 * @param options
 * @param [options.paths]
 * @param [options.parent]
 * @param [options.names]
 * @param [options.data]
 * @param [options.mode]
 * @param [options.minFiles]
 * @param [options.maxFiles]
 * @param [options.nameLength]
 * @param [options.dataLength]
 * @return {Array}
 */
TestUtil.generateRandomFiles = function (options) {
    var paths = _.get(options, 'paths');
    var parent = _.get(options, 'parent');
    var names = _.get(options, 'names');
    var data = _.get(options, 'data');
    var mode = _.get(options, 'mode', parseInt('700', 8));
    var minFiles = _.get(options, 'minFiles', 1);
    var maxFiles = _.get(options, 'maxFiles', 10);
    var nameLength = _.get(options, 'nameLength', 10);
    var dataLength = _.get(options, 'dataLength', 10);

    if (!_.isNil(paths)) {
        return _.map(paths, function (path, index) {
            return TestUtil.generateRandomFile({
                path: path,
                data: _.get(data, index),
                mode: mode,
                dataLength: dataLength
            });
        });
    } else {
        if (_.isNil(parent)) {
            var dirInfo = TestUtil.createDirectory({
                nameLength: nameLength,
                mode: mode
            });
            parent = dirInfo.path;
        }

        if (_.isNil(names)) {
            names = [];
            for (var i = 0; i < random.getInteger(minFiles, maxFiles); i++) {
                names.push(random.getString(nameLength));
            }
        }

        return _.map(names, function (name, index) {
            return TestUtil.generateRandomFile({
                parent: parent,
                name: name,
                data: _.get(data, index),
                mode: mode,
                nameLength: nameLength,
                dataLength: dataLength
            });
        });
    }
};

/**
 *
 * @param options
 * @param [options.paths]
 * @param [options.parent]
 * @param [options.names]
 * @param [options.mode]
 * @param [options.minDirectories]
 * @param [options.maxDirectories]
 * @param [options.nameLength]
 * @return {Array}
 */
TestUtil.createDirectories = function (options) {
    var paths = _.get(options, 'paths');
    var parent = _.get(options, 'parent');
    var names = _.get(options, 'names');
    var mode = _.get(options, 'mode', parseInt('700', 8));
    var minDirectories = _.get(options, 'minDirectories', 1);
    var maxDirectories = _.get(options, 'maxDirectories', 10);
    var nameLength = _.get(options, 'nameLength', 10);

    if (!_.isNil(paths)) {
        return _.map(paths, function (path, index) {
            return TestUtil.createDirectory({path: path, mode: mode});
        });
    } else {
        if (_.isNil(parent)) {
            var dirInfo = TestUtil.createDirectory({mode: mode, nameLength: nameLength});
            parent = dirInfo.path;
        }

        if (_.isNil(names)) {
            names = [];
            for (var i = 0; i < random.getInteger(minDirectories, maxDirectories); i++) {
                names.push(random.getString(nameLength));
            }
        }

        return _.map(names, function (name, index) {
            return TestUtil.createDirectory({parent: parent, name: name, mode: mode, nameLength: nameLength});
        });
    }
};

/**
 * @param options
 * @param [options.path]
 * @param [options.levels]
 * @param [options.mode]
 * @param [options.minFiles]
 * @param [options.maxFiles]
 * @param [options.minDirectories]
 * @param [options.maxDirectories]
 * @param [options.nameLength]
 * @param [options.dataLength]
 */
TestUtil.createFileTree = function (options) {
    var path = _.get(options, 'path');
    var parent = _.get(options, 'parent');
    var name = _.get(options, 'name');
    var levels = _.get(options, 'levels', 1);
    var mode = _.get(options, 'mode', parseInt('700', 8));
    var minFiles = _.get(options, 'minFiles');
    var maxFiles = _.get(options, 'maxFiles');
    var minDirectories = _.get(options, 'minDirectories');
    var maxDirectories = _.get(options, 'maxDirectories');
    var nameLength = _.get(options, 'nameLength');
    var dataLength = _.get(options, 'dataLength');

    if (!_.isNil(path)) {
        var pathInfo = _path.parse(path);
        name = pathInfo.base;
        parent = pathInfo.dir;
    } else {
        if (_.isNil(parent)) {
            var dirInfo = TestUtil.createDirectory({mode: mode, nameLength: nameLength});
            parent = dirInfo.path;
        }

        if (_.isNil(name)) {
            name = random.getString(nameLength);
        }

        path = _path.resolve(parent, name);
    }

    var tree = TestUtil.createDirectory({path: path, mode: mode});


    if (levels === 0) {
        tree.files = TestUtil.generateRandomFiles({
            parent: path,
            mode: mode,
            maxFiles: maxFiles,
            minFiles: minFiles,
            nameLength: nameLength,
            dataLength: dataLength
        });
    } else {
        var subdirectories = TestUtil.createDirectories({
            parent: path,
            mode: mode,
            minDirectories: minDirectories,
            maxDirectories: maxDirectories,
            nameLength: nameLength
        });

        var files = TestUtil.generateRandomFiles({
            parent: path,
            mode: mode,
            maxFiles: maxFiles,
            minFiles: minFiles,
            nameLength: nameLength,
            dataLength: dataLength
        });
        tree.files = _.concat(files, subdirectories);

        _.each(subdirectories, function (subdirectory) {
            _.assign(subdirectory, TestUtil.createFileTree({
                path: subdirectory.path,
                levels: levels - 1,
                mode: mode,
                minFiles: minFiles,
                maxFiles: maxFiles,
                minDirectories: minDirectories,
                maxDirectories: maxDirectories,
                nameLength: nameLength,
                dataLength: dataLength
            }));

        });
    }

    return tree;
};

TestUtil.walkFileTree = function (fileTree, callback, includeBasePath) {

    var stat = function (path) {
        try {
            return _fs.statSync(path);
        } catch (err) {
            if (err.code === 'ENOENT') {
                return null;
            } else {
                throw err;
            }
        }
    };

    var visit = function (node) {
        callback(node, stat(node.path));
        _.each(node.files, visit);
    };

    if (includeBasePath) {
        callback(fileTree, stat(fileTree.path));
    }
    _.each(fileTree.files, visit);
};

module.exports = TestUtil;
