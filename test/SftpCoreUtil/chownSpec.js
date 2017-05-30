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

    describe("chown()", function () {

        describe("on a file", function () {

            beforeEach(function () {
                var variables = this;
                var tempDir = variables.tempDir;
                variables.tempFile = TestUtil.generateRandomFile({parent: tempDir.path});
            });

            it("should change the uid & gid of a file", function () {
                var variables = this;
                var ssh2Client = variables.ssh2Client;
                var sftpCoreUtil = variables.sftpCoreUtil;
                var tempFile = variables.tempFile;

                return sftpCoreUtil.chown({path: tempFile.path, uid: 5000, gid: 5000})
                    .catch(function (err) {
                        console.error(err);
                        throw err;
                    })
                    .should.be.fulfilled
                    .then(function () {
                        var stats = fs.statSync(tempFile.path);

                        stats.uid.should.be.equal(5000);
                        stats.gid.should.be.equal(5000);
                    })
            });
        });

        describe("on a directory with recursive", function () {
            beforeEach(function () {
                var variables = this;
                var tempDir = variables.tempDir;
                variables.fileTree = TestUtil.createFileTree({parent: tempDir.path});
            });

            it("should change the uid & gid of all files", function () {
                var variables = this;
                var sftpCoreUtil = variables.sftpCoreUtil;
                var fileTree = variables.fileTree;

                return sftpCoreUtil.chown({path: fileTree.path, recursive: true, uid: 5000, gid: 5000})
                    .catch(function (err) {
                        console.error(err);
                        throw err;
                    })
                    .should.be.fulfilled
                    .then(function () {

                        TestUtil.walkFileTree(fileTree, function (node, stats) {
                            var check = function () {
                                try {
                                    TestUtil.walkFileTree(fileTree, function (node, stats) {
                                        expect(stats).to.be.not.null;
                                        stats.uid.should.be.equal(5000);
                                        stats.gid.should.be.equal(5000);
                                    });
                                } catch (err) {
                                    console.error(err);
                                    throw err;
                                }
                            }

                            check.should.not.throw();
                        }, true);
                    })
            });
        })

    });

});
