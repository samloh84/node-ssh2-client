const Promise = require('bluebird');
const describe = mocha.describe,
    it = mocha.it,
    beforeEach = mocha.beforeEach;
const util = require('util');
const Ssh2Client = require('../../lib/Ssh2Client');
const fs = require('fs');
const _ = require('lodash');
describe("Ssh2Client", function () {

    beforeEach(function () {
        var variables = this;
        variables.ssh2Client = TestUtil.createSsh2Client();
    });

    describe("connect()", function () {
        it("should connect to SSH Server", function () {
            var variables = this;
            var ssh2Client = variables.ssh2Client;

            return ssh2Client.connect()

                .catch(function (err) {
                    console.error(err);
                    throw err;
                })
                .should.be.fulfilled
                .then(function () {
                    ssh2Client._client.should.be.defined;
                });

        })

    });

});
