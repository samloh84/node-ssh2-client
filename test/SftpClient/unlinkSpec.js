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
    describe("unlink()", function () {

        beforeEach(function () {
            var variables = this;
            var tempDir = variables.tempDir;
            variables.tempFile = TestUtil.generateRandomFile({parent: tempDir.path});
        });

        it("should unlink the supplied path", function () {
            var variables = this;
            var sftpClient = variables.sftpClient;
            var tempFile = variables.tempFile;

            return sftpClient.unlink({path: tempFile.path})

                .catch(function (err) {
                    console.error(err);
                    throw err;
                })
                .should.be.fulfilled
                .then(function () {
                    var stats = fs.statSync(tempFile.path);
                    console.log(util.inspect(stats));
                })

                .should.be.rejected;
        });
    });

});
