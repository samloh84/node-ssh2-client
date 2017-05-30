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

    describe("ls()", function () {

        describe("on a directory", function () {

            beforeEach(function () {
                var variables = this;
                var tempDir = variables.tempDir;
                variables.tempFiles = TestUtil.generateRandomFiles({parent: tempDir.path});
            });

            it("should list files for the supplied directory path", function () {
                var variables = this;
                var ssh2Client = variables.ssh2Client;
                var sftpCoreUtil = variables.sftpCoreUtil;
                var tempDir = variables.tempDir;
                var tempFiles = variables.tempFiles;

                var fileTree = variables.fileTree;
                return sftpCoreUtil.ls({path: tempDir.path})
                    .catch(function (err) {
                        console.error(err);
                        throw err;
                    })
                    .should.be.fulfilled
                    .then(function (files) {
                        console.log(util.inspect(files, {depth: null}));

                        var check = function () {
                            _.each(tempFiles, function (file, stats) {
                                var value = _.find(files, {path: file.path});
                                expect(value, 'Could not find file ' + file.path + ' in ls output').to.not.be.undefined;
                            });
                        };


                        check.should.not.throw();


                    });
            });
        });

        describe("on a source directory path with target directory path and recursive = true", function () {
            beforeEach(function () {
                var variables = this;
                var tempDir = variables.tempDir;
                variables.fileTree = TestUtil.createFileTree({path: tempDir.path});
            });

            it("should list a file tree recursively", function () {
                var variables = this;
                var sftpCoreUtil = variables.sftpCoreUtil;
                var fileTree = variables.fileTree;

                return sftpCoreUtil.ls({path: fileTree.path, recursive: true})
                    .catch(function (err) {
                        console.error(err);
                        throw err;
                    })
                    .should.be.fulfilled
                    .then(function (files) {
                        console.log(util.inspect(files, {depth: null}));

                        var check = function () {
                            TestUtil.walkFileTree(fileTree, function (file, stats) {
                                var value = _.find(files, {path: file.path});
                                expect(value, 'Could not find file ' + file.path + ' in ls output').to.not.be.undefined;
                            });
                        };

                        check.should.not.throw();


                    })
            });
        })

    });

});
