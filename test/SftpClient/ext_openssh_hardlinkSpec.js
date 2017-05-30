const Promise = require('bluebird');

const util = require('util');
const fs = require('fs');
const _path = require('path');
const _ = require('lodash');
const SftpClient = require('../../lib').SftpClient;
describe("SftpClient", function () {
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
        variables.sftpClient = TestUtil.createSftpClient();
    });
    describe("ext_openssh_hardlink()", function () {

        beforeEach(function () {
            var variables = this;
            var tempDir = variables.tempDir;
            variables.tempFile = TestUtil.generateRandomFile({parent: tempDir.path});
        });

        it("should create a link", function () {
            var variables = this;
            var sftpClient = variables.sftpClient;
            var tempDir = variables.tempDir;

            var tempFile = variables.tempFile;
            var tempLinkFile = variables.tempLinkFile = _path.resolve(tempDir.path, TestUtil.random.getString(10));

            return sftpClient.ext_openssh_hardlink({targetPath: tempFile.path, linkPath: tempLinkFile})
                .then(function () {
                    var tempFileStats = fs.statSync(tempFile.path);
                    var tempLinkFileStats = fs.statSync(tempLinkFile);
                    tempFileStats.ino.should.equal(tempLinkFileStats.ino);
                })

                .catch(function (err) {
                    console.error(err);
                    throw err;
                })
                .should.be.fulfilled;
        });
    });

});
