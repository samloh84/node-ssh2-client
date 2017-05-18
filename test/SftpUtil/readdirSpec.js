const Promise = require('bluebird');
const mocha = require('mocha');
const describe = mocha.describe,
    it = mocha.it,
    before = mocha.before,
    beforeEach = mocha.beforeEach,
    after = mocha.after,
    afterEach = mocha.afterEach;
const chai = require("chai");
const util = require('util');
const fs = require('fs');
const _path = require('path');
const _ = require('lodash');
const Ssh2ClientUtil = require('../../lib').Ssh2ClientUtil;
const SftpUtil = require('../../lib').SftpUtil;

const FileTestUtil = require('../../util/FileTestUtil');
const Ssh2ClientUtilTestUtil = require('../../util/Ssh2ClientUtilTestUtil');
const chaiAsPromised = require("chai-as-promised");

chaiAsPromised.transferPromiseness = function (assertion, promise) {
    _.each(Promise.prototype, function (fn, fnName) {
        if (_.isFunction(fn)) {
            _.set(assertion, fnName, fn.bind(Promise.resolve(promise)));
        }
    });
};

chai.use(chaiAsPromised);
chai.should();
chai.config.includeStack = true;

describe("SftpUtil", function () {
    before(function () {
        var variables = this;
        variables.tempDir = FileTestUtil.mkdtemp();
    });

    after(function () {
        var variables = this;
        var tempDir = variables.tempDir;
        FileTestUtil.rmrf(tempDir);
    });

    describe("readdir()", function () {

        beforeEach(function () {
            var variables = this;
            var tempDir = variables.tempDir;

            var tempFiles = variables.tempFiles = [];
            var tempFilesContents = variables.tempFilesContents = [];
            for (var i = 0; i < Math.ceil(Math.random() * 9) + 1; i++) {
                tempFiles[i] = _path.resolve(tempDir, FileTestUtil.randomString(10));
                tempFilesContents[i] = FileTestUtil.randomString(32);
                FileTestUtil.writeFileSync(tempFiles[i], tempFilesContents[i], {mode: SftpUtil.constants.S_IRWXU | SftpUtil.constants.S_IRWXG});
            }


            var ssh2Client = variables.ssh2Client = Ssh2ClientUtilTestUtil.createSsh2ClientUtil();
            var sftpUtil;
            return ssh2Client.connect()
                .then(function () {
                    return ssh2Client.getSftpUtil()
                        .tap(function (_sftpUtil) {
                            sftpUtil = variables.sftpUtil = _sftpUtil;
                        })
                });
        });


        it("should list files for the supplied directory path", function () {
            var variables = this;
            var ssh2Client = variables.ssh2Client;
            var sftpUtil = variables.sftpUtil;
            var tempDir = variables.tempDir;

            var tempFiles = variables.tempFiles;
            return sftpUtil.readdir({location: tempDir})
                .catch(function (err) {
                    console.error(err);
                    throw err;
                })
                .should.be.fulfilled
                .then(function (files) {
                    _.each(tempFiles, function (tempFile) {
                        _.find(files, {filename: _path.basename(tempFile)}).should.not.be.undefined;
                    })
                });
        });
    });

});
