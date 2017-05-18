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

    describe("open()", function () {

        beforeEach(function () {
            var variables = this;
            var tempDir = variables.tempDir;
            var tempFile = variables.tempFile = _path.resolve(tempDir, FileTestUtil.randomString(10));
            var tempFileContents = variables.tempFileContents = FileTestUtil.randomString(32);
            FileTestUtil.writeFileSync(tempFile, tempFileContents, {mode: SftpUtil.constants.S_IRWXU | SftpUtil.constants.S_IRWXG});

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

        afterEach(function () {
            var variables = this;
            var tempFileFd = variables.tempFileFd;
            var sftpUtil = variables.sftpUtil;
            return sftpUtil.close({handle: tempFileFd});
        });

        it("should open the file and return a file descriptor", function () {
            var variables = this;
            var ssh2Client = variables.ssh2Client;
            var sftpUtil = variables.sftpUtil;
            var tempFile = variables.tempFile;
            var tempFileContents = variables.tempFileContents;

            return sftpUtil.open({filename: tempFile, flags: 'r+'})
                .catch(function (err) {
                    console.error(err);
                    throw err;
                })
                .should.be.fulfilled
                .then(function (tempFileFd) {
                    variables.tempFileFd = tempFileFd;

                    var bytesRead, buffer = Buffer.alloc(32);

                    var currentPosition = 0;
                    var data = [];

                    function readLoop() {
                        return sftpUtil.read({
                            handle: tempFileFd,
                            buffer: buffer,
                            offset: 0,
                            length: buffer.length,
                            position: currentPosition
                        })
                            .then(function (readResult) {

                                var bytesRead = readResult.bytesRead;
                                if (bytesRead > 0) {
                                    data.push(buffer.slice(0, bytesRead));
                                    currentPosition += bytesRead;
                                    return readLoop();
                                } else {
                                    data = Buffer.concat(data).toString('utf8');

                                    data.should.be.equal(tempFileContents);

                                }


                            })
                    }

                    return readLoop()
                        .should.be.fulfilled;
                });
        });
    });

});
