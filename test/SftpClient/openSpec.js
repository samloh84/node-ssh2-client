const Promise = require('bluebird');
const util = require('util');
const fs = require('fs');
const _ = require('lodash');
const SftpClient = require('../../lib').SftpClient;
describe("SftpClient", function () {
    before(function () {
        var variables = this;
        variables.tempDir = TestUtil.createDirectory();
        variables.sftpClient = TestUtil.createSftpClient();
    });
    after(function () {
        var variables = this;
        TestUtil.fs.rm({path: variables.tempDir.parent});
    });

    beforeEach(function () {
        var variables = this;
        variables.sftpClient = TestUtil.createSftpClient();
    });
    describe("open()", function () {
        beforeEach(function () {
            var variables = this;
            var tempDir = variables.tempDir;
            variables.tempFile = TestUtil.generateRandomFile({parent: tempDir.path});
        });

        afterEach(function () {
            var variables = this;
            var tempFileFd = variables.tempFileFd;
            var sftpClient = variables.sftpClient;
            return sftpClient.close({handle: tempFileFd});
        });

        it("should open the file and return a file descriptor", function () {
            var variables = this;
            var sftpClient = variables.sftpClient;
            var tempFile = variables.tempFile;

            return sftpClient.open({filename: tempFile.path, flags: 'r+'})
                .then(function (tempFileFd) {
                    variables.tempFileFd = tempFileFd;

                    var buffer = Buffer.alloc(32);

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

                    return readLoop();
                })

                .catch(function (err) {
                    console.error(err);
                    throw err;
                })
                .should.be.fulfilled;
        });
    });

});
