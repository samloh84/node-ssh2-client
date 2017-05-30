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

    describe("rm()", function () {

        describe("on a source file path with target file path", function () {

            beforeEach(function () {
                var variables = this;
                var tempDir = variables.tempDir;
                variables.tempFile = TestUtil.generateRandomFile({parent: tempDir.path});
            });

            it("should delete a file", function () {
                var variables = this;
                var sftpCoreUtil = variables.sftpCoreUtil;
                var tempDir = variables.tempDir;
                var tempFile = variables.tempFile;

                return sftpCoreUtil.rm({path: tempFile.path})
                    .catch(function (err) {
                        console.error(err);
                        throw err;
                    })
                    .should.be.fulfilled
                    .then(function () {
                        var check = function () {
                            return fs.accessSync(tempFile.path)
                        }
                        check.should.throw();
                    });
            });
        });

        describe("on a source directory path with target directory path and recursive = true", function () {
            beforeEach(function () {
                var variables = this;
                var tempDir = variables.tempDir;
                variables.fileTree = TestUtil.createFileTree({parent: tempDir.path});
            });

            it("should remove a file tree", function () {
                var variables = this;
                var sftpCoreUtil = variables.sftpCoreUtil;
                var tempDir = variables.tempDir;
                var fileTree = variables.fileTree;

                return sftpCoreUtil.rm({path: fileTree.path, recursive: true})
                    .catch(function (err) {
                        console.error(err);
                        throw err;
                    })
                    .should.be.fulfilled
                    .then(function () {
                        TestUtil.walkFileTree(fileTree, function (node, stats) {

                            var check = function () {
                                try {
                                    expect(stats).to.be.null;
                                } catch (err) {
                                    console.error(err);
                                    throw err;
                                }
                            };
                            check.should.not.throw();
                        }, true);
                    })
            });
        })

    });
});
