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
    describe("utimes()", function () {

        beforeEach(function () {
            var variables = this;
            var tempDir = variables.tempDir;
            variables.tempFile = TestUtil.generateRandomFile({parent: tempDir.path});

        });

        it("should change the mode of a file", function () {
            var variables = this;
            var sftpClient = variables.sftpClient;
            var tempFile = variables.tempFile;

            var atime = Math.ceil(Math.random() * 10000);
            var mtime = Math.ceil(Math.random() * 10000);
            return sftpClient.utimes({path: tempFile.path, atime: atime, mtime: mtime})
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
