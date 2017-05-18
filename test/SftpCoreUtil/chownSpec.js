const Promise = require('bluebird');
const mocha = require('mocha');
const describe = mocha.describe,
    it = mocha.it,
    before = mocha.before,
    beforeEach = mocha.beforeEach,
    after = mocha.after,
    afterEach = mocha.afterEach;
const chai = require("chai");
const util = require('util');
const fs = require('fs');
const _path = require('path');
const _ = require('lodash');
const Ssh2ClientUtil = require('../../lib').Ssh2ClientUtil;
const SftpUtil = require('../../lib').SftpUtil;
const FileTestUtil = require('../../util/FileTestUtil');
const Ssh2ClientUtilTestUtil = require('../../util/Ssh2ClientUtilTestUtil');
const chaiAsPromised = require("chai-as-promised");

chaiAsPromised.transferPromiseness = function (assertion, promise) {
    _.each(Promise.prototype, function (fn, fnName) {
        if (_.isFunction(fn)) {
            _.set(assertion, fnName, fn.bind(Promise.resolve(promise)));
        }
    });
};

chai.use(chaiAsPromised);
chai.should();
chai.config.includeStack = true;

describe("CoreUtil", function () {
    before(function () {
        var variables = this;
        variables.tempDir = FileTestUtil.mkdtemp();
    });

    after(function () {
        var variables = this;
        var tempDir = variables.tempDir;
        FileTestUtil.rmrf(tempDir);
    });

    describe("chown()", function () {

        beforeEach(function () {
            var variables = this;
            var ssh2Client = variables.ssh2Client = Ssh2ClientUtilTestUtil.createSsh2ClientUtil();
            var sftpUtil, sftpCoreUtil;
            return ssh2Client.connect()
                .then(function () {
                    return ssh2Client.getSftpUtil()
                        .tap(function (_sftpUtil) {
                            sftpUtil = variables.sftpUtil = _sftpUtil;
                        })
                })
                .then(function () {
                    return sftpUtil.getSftpCoreUtil()
                        .tap(function (_sftpCoreUtil) {
                            sftpCoreUtil = variables.sftpCoreUtil = _sftpCoreUtil;
                        })
                });
        });

        afterEach(function () {
            var variables = this;
            var ssh2Client = variables.ssh2Client;
            return ssh2Client.end();
        });

        describe("on a file", function () {
            beforeEach(function () {
                var variables = this;
                var tempDir = variables.tempDir;
                var tempFile = variables.tempFile = _path.resolve(tempDir, FileTestUtil.randomString(10));
                var tempFileContents = variables.tempFileContents = FileTestUtil.randomString(32);
                FileTestUtil.writeFileSync(tempFile, tempFileContents, {mode: SftpUtil.constants.S_IRWXU | SftpUtil.constants.S_IRWXG});
            });

            it("should change the uid & gid of a file", function () {
                var variables = this;
                var ssh2Client = variables.ssh2Client;
                var sftpCoreUtil = variables.sftpCoreUtil;
                var tempFile = variables.tempFile;

                return sftpCoreUtil.chown({path: tempFile, uid: 5000, gid: 5000})
                    .catch(function (err) {
                        console.error(err);
                        throw err;
                    })
                    .should.be.fulfilled
                    .then(function () {
                        var stats = fs.statSync(tempFile);

                        stats.uid.should.be.equal(5000);
                        stats.gid.should.be.equal(5000);
                    })
            });
        });

        describe("on a directory with recursive", function () {
            beforeEach(function () {
                var variables = this;
                var tempDir = variables.tempDir;

                var tempWorkDir = variables.tempWorkDir = _path.resolve(tempDir, FileTestUtil.randomString(10));
                FileTestUtil.mkdir(tempWorkDir);

                var tempSubDirs = variables.tempSubDirs = [];
                var tempFiles = variables.tempFiles = [];
                var tempFilesContents = variables.tempFilesContents = [];
                for (var i = 0; i < Math.ceil(Math.random() * 9) + 1; i++) {
                    tempSubDirs[i] = _path.resolve(tempWorkDir, FileTestUtil.randomString(10));

                    FileTestUtil.mkdir(tempSubDirs[i]);

                    for (var j = 0; j < Math.ceil(Math.random() * 9) + 1; j++) {
                        tempFiles[j] = _path.resolve(tempSubDirs[i], FileTestUtil.randomString(10));
                        tempFilesContents[j] = FileTestUtil.randomString(32);

                        FileTestUtil.writeFileSync(tempFiles[j], tempFilesContents[j], {mode: SftpUtil.constants.S_IRWXU});
                    }
                }
            });

            it("should change the uid & gid of all files", function () {
                var variables = this;
                var ssh2Client = variables.ssh2Client;
                var sftpCoreUtil = variables.sftpCoreUtil;
                var tempSubDirs = variables.tempSubDirs;
                var tempDir = variables.tempDir;
                var tempFiles = variables.tempFiles;

                return sftpCoreUtil.chown({path: tempDir, recursive: true, uid: 5000, gid: 5000})
                    .catch(function (err) {
                        console.error(err);
                        throw err;
                    })
                    .should.be.fulfilled
                    .then(function () {
                        _.each(tempSubDirs, function (tempSubDir) {
                            var stats = fs.statSync(tempSubDir);

                            stats.uid.should.be.equal(5000);
                            stats.gid.should.be.equal(5000);
                        });
                        _.each(tempFiles, function (tempFile) {
                            var stats = fs.statSync(tempFile);

                            stats.uid.should.be.equal(5000);
                            stats.gid.should.be.equal(5000);
                        });

                    })
            });
        })

    });

});
