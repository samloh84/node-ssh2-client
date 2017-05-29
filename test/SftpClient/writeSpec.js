const Promise = require('bluebird');
const util = require('util');
const fs = require('fs');
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

    describe("write()", function () {

        beforeEach(function () {
            var variables = this;
            var tempDir = variables.tempDir;
            var tempFile = variables.tempFile = TestUtil.generateRandomFile({parent: tempDir.path});
            var sftpClient = variables.sftpClient;
            return sftpClient.open({filename: tempFile.path, flags: 'w+'})
                .then(function (tempFileFd) {
                    variables.tempFileFd = tempFileFd;
                });
        });

        afterEach(function () {
            var variables = this;
            var tempFileFd = variables.tempFileFd;
            var sftpClient = variables.sftpClient;
            return sftpClient.close({handle: tempFileFd});
        });

        describe("supplied with a Buffer", function () {
            it("should write to the supplied file descriptor", function () {
                var variables = this;
                var sftpClient = variables.sftpClient;
                var tempFile = variables.tempFile;
                var tempFileContents = variables.tempFileContents = TestUtil.random.getString(32);
                var tempFileFd = variables.tempFileFd;
                var tempFileContentsBuffer = Buffer.from(tempFileContents);
                return sftpClient.write({
                    handle: tempFileFd,
                    buffer: tempFileContentsBuffer,
                    offset: 0,
                    length: tempFileContentsBuffer.length,
                    position: 0
                })
                    .then(function () {

                        var text = fs.readFileSync(tempFile.path);
                        text.toString().should.equal(tempFileContents);
                    })
                    .catch(function (err) {
                        console.error(err);
                        throw err;
                    })
                    .should.be.fulfilled;

            });
        });

    });

});
