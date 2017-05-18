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

    describe("createWriteStream()", function () {

        beforeEach(function () {
            var variables = this;
            var tempDir = variables.tempDir;
            variables.tempFile = _path.resolve(tempDir, FileTestUtil.randomString(10));


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

        it("should create a writable Stream", function () {
            var variables = this;
            var ssh2Client = variables.ssh2Client;
            var sftpUtil = variables.sftpUtil;
            var tempFile = variables.tempFile;
            var tempFileContents = FileTestUtil.randomString(32);

            return sftpUtil.createWriteStream({path: tempFile})
                .catch(function (err) {
                    console.error(err);
                    throw err;
                })
                .should.be.fulfilled
                .then(function (writeStream) {
                    return new Promise(function (resolve, reject) {
                        writeStream.on('finish', function () {
                            resolve();
                        });

                        writeStream.on('error', function (err) {
                            reject(err);
                        });

                        writeStream.write(tempFileContents);
                        writeStream.end();

                    });
                })
                .catch(function (err) {
                    console.error(err);
                    throw err;
                })
                .should.be.fulfilled
                .then(function () {
                    var text = fs.readFileSync(tempFile, 'utf8');
                    text.should.be.equal(tempFileContents);
                });

        });
    });

});
