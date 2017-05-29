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
    describe("cp()", function () {

        describe("on a source file path with destination file path", function () {
            beforeEach(function () {
                var variables = this;
                var tempDir = variables.tempDir;
                variables.tempFile = TestUtil.generateRandomFile({parent: tempDir.path});
                variables.destinationPath = _path.resolve(tempDir.path, TestUtil.random.getString(10));
            });

            it("should copy a file", function () {
                var variables = this;
                var sftpCoreUtil = variables.sftpCoreUtil;
                var tempDir = variables.tempDir;
                var tempFile = variables.tempFile;
                var destinationPath = variables.destinationPath;

                return sftpCoreUtil.cp({source: tempFile.path, destination: destinationPath})
                    .catch(function (err) {
                        console.error(err);
                        throw err;
                    })
                    .should.be.fulfilled
                    .then(function () {
                        var check = function () {
                            fs.statSync(tempFile.path);
                        }
                        check.should.not.throw();

                        var text = fs.readFileSync(destinationPath, 'utf8');
                        text.should.be.equal(tempFile.data);
                    })
            });
        });

        describe("on a source file path with destination directory path", function () {
            beforeEach(function () {
                var variables = this;
                var tempDir = variables.tempDir;
                variables.tempFile = TestUtil.generateRandomFile({parent: tempDir.path});
                variables.tempDestinationDir = TestUtil.createDirectory({parent: tempDir.path});
            });

            it("should copy a file", function () {
                var variables = this;
                var ssh2Client = variables.ssh2Client;
                var sftpCoreUtil = variables.sftpCoreUtil;
                var tempFile = variables.tempFile;
                var tempDestinationDir = variables.tempDestinationDir;

                return sftpCoreUtil.cp({source: tempFile.path, destination: tempDestinationDir.path})
                    .catch(function (err) {
                        console.error(err);
                        throw err;
                    })
                    .should.be.fulfilled
                    .then(function () {
                        var check = function () {
                            fs.statSync(tempFile.path);
                        };
                        check.should.not.throw();

                        var tempFileDestination = _path.resolve(tempDestinationDir.path, _path.basename(tempFile.path));

                        var text = fs.readFileSync(tempFileDestination, 'utf8');
                        text.should.be.equal(tempFile.data);
                    })
            });
        });

        describe("on a source directory path with target path and recursive = true", function () {
            beforeEach(function () {
                var variables = this;
                var tempDir = variables.tempDir;
                variables.fileTree = TestUtil.createFileTree({parent: tempDir.path});
                variables.destinationPath = _path.resolve(tempDir.path, TestUtil.random.getString(10));
            });

            it("should copy a file tree", function () {
                var variables = this;
                var sftpCoreUtil = variables.sftpCoreUtil;
                var tempDir = variables.tempDir;
                var destinationPath = variables.destinationPath;
                var fileTree = variables.fileTree;

                return sftpCoreUtil.cp({
                    source: fileTree.path,
                    destination: destinationPath,
                    recursive: true
                })
                    .catch(function (err) {
                        console.error(err);
                        throw err;
                    })
                    .should.be.fulfilled
                    .then(function () {
                        TestUtil.walkFileTree(fileTree, function (node, stats) {
                            var check = function () {
                                try {
                                    expect(stats).to.be.not.null;

                                    var destinationFilePath = _path.resolve(destinationPath, _path.relative(fileTree.path, node.path));

                                    var destinationFileStats = fs.statSync(destinationFilePath);
                                    expect(destinationFileStats).to.not.be.undefined;

                                    if (!_.isNil(node.data)) {
                                        var text = fs.readFileSync(destinationFilePath, 'utf8');
                                        text.should.be.equal(node.data);
                                    }
                                } catch (err) {
                                    console.error(err);
                                    throw err;
                                }
                            };
                            check.should.not.throw();
                        });

                    })
            });
        });

        describe("on a source directory path with target directory path and recursive = true", function () {
            beforeEach(function () {
                var variables = this;
                var tempDir = variables.tempDir;
                variables.fileTree = TestUtil.createFileTree({parent: tempDir.path});
                variables.tempDestinationDir = TestUtil.createDirectory({parent: tempDir.path});
            });

            it("should copy a file tree", function () {
                var variables = this;
                var sftpCoreUtil = variables.sftpCoreUtil;
                var tempDestinationDir = variables.tempDestinationDir;
                var fileTree = variables.fileTree;

                return sftpCoreUtil.cp({
                    source: fileTree.path,
                    destination: tempDestinationDir.path,
                    recursive: true
                })
                    .catch(function (err) {
                        console.error(err);
                        throw err;
                    })
                    .should.be.fulfilled
                    .then(function () {
                        TestUtil.walkFileTree(fileTree, function (node, stats) {
                            var check = function () {
                                try {
                                    expect(stats).to.be.not.null;

                                    var destinationFilePath = _path.resolve(tempDestinationDir.path, _path.relative(fileTree.parent, node.path));

                                    var destinationFileStats = fs.statSync(destinationFilePath);
                                    expect(destinationFileStats).to.not.be.undefined;

                                    if (!_.isNil(node.data)) {
                                        var text = fs.readFileSync(destinationFilePath, 'utf8');
                                        text.should.be.equal(node.data);
                                    }
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
