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
    describe("read()", function () {

        beforeEach(function () {
            var variables = this;
            var tempDir = variables.tempDir;
            var tempFile = variables.tempFile = TestUtil.generateRandomFile({parent: tempDir.path});
            var sftpClient = variables.sftpClient;
            return sftpClient.open({filename: tempFile.path, flags: 'r+'})
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

        it("should read the supplied file descriptor", function () {
            var variables = this;
            var sftpClient = variables.sftpClient;
            var tempFileFd = variables.tempFileFd;
            var tempFile = variables.tempFile;
            var buffer = Buffer.alloc(Buffer.byteLength(tempFile.data));

            var currentPosition = 0;
            var data = [];

            function readLoop() {
                return sftpClient.read({
                    handle: tempFileFd,
                    buffer: buffer,
                    offset: 0,
                    length: buffer.length,
                    position: currentPosition
                })
                    .then(function (readResult) {

                        var bytesRead = readResult.bytesRead;
                        if (bytesRead > 0) {
                            data.push(buffer.slice(0, bytesRead));
                            currentPosition += bytesRead;
                            return readLoop();
                        } else {
                            data = Buffer.concat(data).toString('utf8');

                            data.should.be.equal(tempFile.data);

                        }

                    })
            }

            return readLoop()

                .catch(function (err) {
                    console.error(err);
                    throw err;
                })
                .should.be.fulfilled;

        });
    });

});
