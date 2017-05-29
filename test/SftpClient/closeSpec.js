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

    describe("close()", function () {

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

        it("should close the supplied file descriptor", function () {
            var variables = this;
            var sftpClient = variables.sftpClient;
            var tempFileFd = variables.tempFileFd;

            return sftpClient.close({handle: tempFileFd})

                .catch(function (err) {
                    console.error(err);
                    throw err;
                })
                .should.be.fulfilled;
        });
    });

});
