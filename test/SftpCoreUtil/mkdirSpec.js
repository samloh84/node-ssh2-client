const Promise = require('bluebird');
const util = require('util');
const fs = require('fs');
const _path = require('path');
const _ = require('lodash');
const Ssh2Client = require('../../lib').Ssh2Client;
const SftpClient = require('../../lib').SftpClient;
describe("SftpCoreUtil", function () {
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
        variables.sftpCoreUtil = TestUtil.createSftpCoreUtil();
    });
    describe("mkdir()", function () {

        describe("on a path", function () {
            beforeEach(function () {
                var variables = this;
                var tempDir = variables.tempDir;
                variables.tempDirToCreate = _path.resolve(tempDir.path, TestUtil.random.getString(10));
            });

            it("should create a directory", function () {
                var variables = this;
                var ssh2Client = variables.ssh2Client;
                var sftpCoreUtil = variables.sftpCoreUtil;
                var tempDirToCreate = variables.tempDirToCreate;

                return sftpCoreUtil.mkdir({path: tempDirToCreate})
                    .catch(function (err) {
                        console.error(err);
                        throw err;
                    })
                    .should.be.fulfilled
                    .then(function () {
                        var check = function () {
                            var stats = fs.statSync(tempDirToCreate);
                            stats.isDirectory().should.be.true;
                        }
                        check.should.not.throw();
                    });

            });
        });

        describe("on a path with parents", function () {
            beforeEach(function () {
                var variables = this;
                var tempDir = variables.tempDir;
                variables.tempDirToCreate = _path.resolve(tempDir.path, TestUtil.random.getString(10), TestUtil.random.getString(10), TestUtil.random.getString(10));
            });

            it("should create a directory", function () {
                var variables = this;
                var ssh2Client = variables.ssh2Client;
                var sftpCoreUtil = variables.sftpCoreUtil;
                var tempDirToCreate = variables.tempDirToCreate;

                return sftpCoreUtil.mkdir({path: tempDirToCreate, parents: true})
                    .catch(function (err) {
                        console.error(err);
                        throw err;
                    })
                    .should.be.fulfilled
                    .then(function () {
                        var check = function () {
                            var stats = fs.statSync(tempDirToCreate);
                            stats.isDirectory().should.be.true;
                        };
                        check.should.not.throw();
                    });

            });
        })

    });

});
