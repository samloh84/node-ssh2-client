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

    describe("createReadStream()", function () {

        beforeEach(function () {
            var variables = this;
            var tempDir = variables.tempDir;
            variables.tempFile = TestUtil.generateRandomFile({parent: tempDir.path});
        });

        it("should create a readable Stream", function () {
            var variables = this;
            var sftpClient = variables.sftpClient;
            var tempFile = variables.tempFile;

            return sftpClient.createReadStream({path: tempFile.path})
                .then(function (readStream) {
                    return new Promise(function (resolve, reject) {
                        var chunks = [];
                        readStream.on('data', function (chunk) {
                            chunks.push(chunk);
                        });
                        readStream.on('end', function () {
                            return resolve(Buffer.concat(chunks).toString('utf8'));
                        });
                        readStream.on('error', function (err) {
                            return reject(err);
                        });
                    })
                })
                .then(function (text) {
                    text.should.equal(tempFile.data);
                })

                .catch(function (err) {
                    console.error(err);
                    throw err;
                })
                .should.be.fulfilled;
        });
    });

});
