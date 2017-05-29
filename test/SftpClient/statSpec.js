const Promise = require('bluebird');

const util = require('util');
const fs = require('fs');
const _ = require('lodash');
const SftpClient = require('../../lib').SftpClient;
const SFTPStream = require('ssh2-streams/lib/sftp');
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
    describe("stat()", function () {

        beforeEach(function () {
            var variables = this;
            var tempDir = variables.tempDir;
            variables.tempFile = TestUtil.generateRandomFile({parent: tempDir.path});
        });

        it("should stat the supplied file descriptor", function () {
            var variables = this;
            var sftpClient = variables.sftpClient;
            var tempFile = variables.tempFile;

            return sftpClient.stat({path: tempFile.path})
                .tap(function (stats) {
                    stats.should.be.an.instanceof(SFTPStream.Stats);

                    console.log(util.inspect(stats));
                })

                .catch(function (err) {
                    console.error(err);
                    throw err;
                })
                .should.be.fulfilled;
        });
    });

});
