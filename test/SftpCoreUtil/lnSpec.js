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

    describe("ln()", function () {

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

        describe("on a file path", function () {
            beforeEach(function () {
                var variables = this;
                var tempDir = variables.tempDir;
                var tempFile = variables.tempFile = _path.resolve(tempDir, FileTestUtil.randomString(10));
                var tempFileContents = variables.tempFileContents = FileTestUtil.randomString(32);
                FileTestUtil.writeFileSync(tempFile, tempFileContents, {mode: SftpUtil.constants.S_IRWXU | SftpUtil.constants.S_IRWXG});
            });

            it("should create a hard link", function () {
                var variables = this;
                var ssh2Client = variables.ssh2Client;
                var sftpCoreUtil = variables.sftpCoreUtil;
                var tempDir = variables.tempDir;

                var tempFile = variables.tempFile;
                var templnFile = variables.templnFile = _path.resolve(tempDir, FileTestUtil.randomString(10));

                return sftpCoreUtil.ln({source: tempFile, destination: templnFile})
                    .catch(function (err) {
                        console.error(err);
                        throw err;
                    })
                    .should.be.fulfilled
                    .then(function () {
                        var tempFileStats = fs.statSync(tempFile);
                        var templnFileStats = fs.statSync(templnFile);
                        tempFileStats.ino.should.equal(templnFileStats.ino);
                    });
            });

            it("should create a symbolic link", function () {
                var variables = this;
                var ssh2Client = variables.ssh2Client;
                var sftpCoreUtil = variables.sftpCoreUtil;
                var tempDir = variables.tempDir;

                var tempFile = variables.tempFile;
                var tempSymlinkFile = variables.tempSymlinkFile = _path.resolve(tempDir, FileTestUtil.randomString(10));

                return sftpCoreUtil.ln({source: tempFile, destination: tempSymlinkFile, symbolic: true})
                    .catch(function (err) {
                        console.error(err);
                        throw err;
                    })
                    .should.be.fulfilled
                    .then(function () {
                        var tempFileStats = fs.statSync(tempFile);
                        var tempSymlinkFileStats = fs.statSync(tempSymlinkFile);
                        tempFileStats.ino.should.equal(tempSymlinkFileStats.ino);

                        var tempFileSymLinkPath = fs.readlinkSync(tempSymlinkFile, 'utf8');
                        tempFileSymLinkPath.should.equal(tempFile);

                    });
            });
        })

    });

});
