const Promise = require('bluebird');
const util = require('util');
const fs = require('fs');
const _path = require('path');
const _ = require('lodash');
const Ssh2Client = require('../../lib').Ssh2Client;
const SftpClient = require('../../lib').SftpClient;
describe("SftpCoreUtil", function () {
    before(function () {
        var variables = this;
        variables.tempDir = TestUtil.createDirectory();
    });

    after(function () {
        var variables = this;
        TestUtil.fs.rm({path: variables.tempDir.parent});
    });
    beforeEach(function () {
        var variables = this;
        variables.sftpCoreUtil = TestUtil.createSftpCoreUtil();
    });

    describe("ln()", function () {

        describe("on a file path", function () {
            beforeEach(function () {
                var variables = this;
                var tempDir = variables.tempDir;
                variables.tempFile = TestUtil.generateRandomFile({parent: tempDir.path});
            });

            it("should create a hard link", function () {
                var variables = this;
                var ssh2Client = variables.ssh2Client;
                var sftpCoreUtil = variables.sftpCoreUtil;
                var tempDir = variables.tempDir;

                var tempFile = variables.tempFile;
                var templnFile = variables.templnFile = _path.resolve(tempDir.path, TestUtil.random.getString(10));

                return sftpCoreUtil.ln({source: tempFile.path, destination: templnFile})
                    .catch(function (err) {
                        console.error(err);
                        throw err;
                    })
                    .should.be.fulfilled
                    .then(function () {
                        var tempFileStats = fs.statSync(tempFile.path);
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
                var tempSymlinkFile = variables.tempSymlinkFile = _path.resolve(tempDir.path, TestUtil.random.getString(10));

                return sftpCoreUtil.ln({source: tempFile.path, destination: tempSymlinkFile, symbolic: true})
                    .catch(function (err) {
                        console.error(err);
                        throw err;
                    })
                    .should.be.fulfilled
                    .then(function () {
                        var tempFileStats = fs.statSync(tempFile.path);
                        var tempSymlinkFileStats = fs.statSync(tempSymlinkFile);
                        tempFileStats.ino.should.equal(tempSymlinkFileStats.ino);

                        var tempFileSymLinkPath = fs.readlinkSync(tempSymlinkFile, 'utf8');
                        tempFileSymLinkPath.should.equal(tempFile.path);

                    });
            });
        })

    });

});
