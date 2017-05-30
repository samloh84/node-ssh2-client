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
    describe("realpath()", function () {

        beforeEach(function () {
            var variables = this;
            var tempDir = variables.tempDir;
            variables.tempFile = TestUtil.generateRandomFile({parent: tempDir.path});

        });

        it("should read the supplied file descriptor", function () {
            var variables = this;
            var sftpClient = variables.sftpClient;
            var tempDir = variables.tempDir;
            var tempFile = variables.tempFile;

            return sftpClient.realpath({path: tempDir.path + _path.sep + _path.relative(tempDir.path, tempFile.path)})
                .then(function (tempFileRealPath) {
                    tempFileRealPath.should.equal(tempFile.path);
                })

                .catch(function (err) {
                    console.error(err);
                    throw err;
                })
                .should.be.fulfilled;
        });
    });

});
