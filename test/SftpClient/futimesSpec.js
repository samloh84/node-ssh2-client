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
    describe("futimes()", function () {

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

        it("should change the mode of a file", function () {
            var variables = this;
            var sftpClient = variables.sftpClient;
            var tempFile = variables.tempFile;
            var tempFileFd = variables.tempFileFd;

            var atime = Math.ceil(Math.random() * 10000);
            var mtime = Math.ceil(Math.random() * 10000);
            return sftpClient.futimes({handle: tempFileFd, atime: atime, mtime: mtime})
                .then(function () {
                    var stats = fs.statSync(tempFile.path);

                    (stats.atime.getTime() / 1000).should.be.equal(atime);
                    (stats.mtime.getTime() / 1000).should.be.equal(mtime);
                })

                .catch(function (err) {
                    console.error(err);
                    throw err;
                })
                .should.be.fulfilled;
        });
    });

});
