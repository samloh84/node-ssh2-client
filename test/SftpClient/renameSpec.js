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
    describe("rename()", function () {

        beforeEach(function () {
            var variables = this;
            var tempDir = variables.tempDir;
            variables.tempFile = TestUtil.generateRandomFile({parent: tempDir.path});
        });

        it("should rename a file", function () {
            var variables = this;
            var sftpClient = variables.sftpClient;
            var tempDir = variables.tempDir;

            var tempFile = variables.tempFile;
            var tempRenameFile = variables.tempRenameFile = _path.resolve(tempDir.path, TestUtil.random.getString(10));

            return sftpClient.rename({srcPath: tempFile.path, destPath: tempRenameFile})
                .then(function () {
                    var text = fs.readFileSync(tempRenameFile, 'utf8');
                    text.should.be.equal(tempFile.data);
                })

                .catch(function (err) {
                    console.error(err);
                    throw err;
                })
                .should.be.fulfilled;
        });
    });

});
