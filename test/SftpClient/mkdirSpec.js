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
    describe("mkdir()", function () {
        it("should create a directory", function () {
            var variables = this;
            var sftpClient = variables.sftpClient;
            var tempDir = variables.tempDir;
            var newDirPath = _path.resolve(tempDir.path, TestUtil.random.getString(32));

            return sftpClient.mkdir({path: newDirPath})
                .then(function () {
                    var stats = fs.statSync(newDirPath);
                    stats.isDirectory().should.be.true;
                })

                .catch(function (err) {
                    console.error(err);
                    throw err;
                })
                .should.be.fulfilled;

        });
    });

});
