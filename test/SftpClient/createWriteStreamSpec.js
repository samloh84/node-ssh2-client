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

    describe("createWriteStream()", function () {

        it("should create a writable Stream", function () {
            var variables = this;
            var tempDir = variables.tempDir;

            var sftpClient = variables.sftpClient;
            var newFilePath = _path.resolve(tempDir.path, TestUtil.random.getString(32));
            var newFileContents = TestUtil.random.getString(32);

            return sftpClient.createWriteStream({path: newFilePath})
                .then(function (writeStream) {
                    return new Promise(function (resolve, reject) {
                        writeStream.on('finish', function () {
                            resolve();
                        });

                        writeStream.on('error', function (err) {
                            reject(err);
                        });

                        writeStream.write(newFileContents);
                        writeStream.end();

                    });
                })
                .then(function () {
                    var text = fs.readFileSync(newFilePath, 'utf8');
                    text.should.be.equal(newFileContents);
                })

                .catch(function (err) {
                    console.error(err);
                    throw err;
                })
                .should.be.fulfilled;

        });
    });

});
