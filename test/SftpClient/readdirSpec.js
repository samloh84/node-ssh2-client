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
    describe("readdir()", function () {

        beforeEach(function () {
            var variables = this;
            var tempDir = variables.tempDir;
            variables.tempFiles = TestUtil.generateRandomFiles({parent: tempDir.path});
        });

        it("should list files for the supplied directory path", function () {
            var variables = this;
            var sftpClient = variables.sftpClient;
            var tempDir = variables.tempDir;
            var tempFiles = variables.tempFiles;
            return sftpClient.readdir({location: tempDir.path})
                .then(function (files) {
                    _.each(tempFiles, function (tempFile) {
                        var value = _.find(files, {filename: _path.basename(tempFile.path)});
                        expect(value).to.not.be.undefined;
                    })
                })

                .catch(function (err) {
                    console.error(err);
                    throw err;
                })
                .should.be.fulfilled;
        });
    });

});
