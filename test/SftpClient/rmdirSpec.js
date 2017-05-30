const Promise = require('bluebird');
const describe = mocha.describe,
    it = mocha.it,
    before = mocha.before,
    beforeEach = mocha.beforeEach,
    after = mocha.after
;
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

    describe("rmdir()", function () {

        beforeEach(function () {
            var variables = this;
            var tempDir = variables.tempDir;
            variables.tempDirToRm = TestUtil.createDirectory({parent: tempDir.path})
        });

        it("should rmdir the supplied path", function () {
            var variables = this;
            var sftpClient = variables.sftpClient;
            var tempDirToRm = variables.tempDirToRm;

            return sftpClient.rmdir({path: tempDirToRm.path})

                .catch(function (err) {
                    console.error(err);
                    throw err;
                })
                .should.be.fulfilled
                .then(function () {
                    var stats = fs.statSync(tempDirToRm);
                    console.log(util.inspect(stats));
                })

                .should.be.rejected;
        });
    });

});
