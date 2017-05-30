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
    describe("readlink()", function () {

        beforeEach(function () {
            var variables = this;
            var tempDir = variables.tempDir;
            var tempFile = variables.tempFile = TestUtil.generateRandomFile({parent: tempDir.path});
            var tempFileSymLinkPath = variables.tempFileSymLinkPath = _path.resolve(tempDir.path, TestUtil.random.getString(10));
            fs.symlinkSync(tempFile.path, tempFileSymLinkPath);
        });

        it("should read the supplied file descriptor", function () {
            var variables = this;
            var sftpClient = variables.sftpClient;
            var tempFile = variables.tempFile;
            var tempFileSymLinkPath = variables.tempFileSymLinkPath;

            return sftpClient.readlink({path: tempFileSymLinkPath})
                .then(function (tempFileSymLinkTargetPath) {
                    tempFileSymLinkTargetPath.should.equal(tempFile.path);
                })

                .catch(function (err) {
                    console.error(err);
                    throw err;
                })
                .should.be.fulfilled;
        });
    });

});
