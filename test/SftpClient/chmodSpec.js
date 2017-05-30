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

    describe("chmod()", function () {

        beforeEach(function () {
            var variables = this;
            var tempDir = variables.tempDir;
            variables.tempFile = TestUtil.generateRandomFile({parent: tempDir.path});
        });

        it("should change the mode of a file", function () {
            var variables = this;
            var sftpClient = variables.sftpClient;
            var tempFile = variables.tempFile;

            return sftpClient.chmod({path: tempFile.path, mode: SftpClient.constants.S_IRWXU})
                .then(function () {
                    var stats = fs.statSync(tempFile.path);

                    (stats.mode & (parseInt(7777, 8))).should.be.equal(SftpClient.constants.S_IRWXU);
                })
                .catch(function (err) {
                    console.error(err);
                    throw err;
                })
                .should.be.fulfilled
        });
    });

});
