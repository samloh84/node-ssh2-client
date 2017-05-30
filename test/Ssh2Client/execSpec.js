const Promise = require('bluebird');
const describe = mocha.describe,
    it = mocha.it,
    beforeEach = mocha.beforeEach;
const util = require('util');
const fs = require('fs');
const _ = require('lodash');
const Ssh2Client = require('../../lib/Ssh2Client');

describe("Ssh2Client", function () {

    beforeEach(function () {
        var variables = this;
        variables.ssh2Client = TestUtil.createSsh2Client();
    });

    describe("exec()", function () {
        it("should exec the command uptime", function () {
            var variables = this;
            var ssh2Client = variables.ssh2Client;

            return ssh2Client.exec({command: 'uptime'})

                .catch(function (err) {
                    console.error(err);
                    throw err;
                })
                .should.be.fulfilled
                .then(function (stream) {
                    return Ssh2Client.consumeChannel(stream);
                })
                .then(function (output) {
                    console.log(util.inspect(output, {depth: null}));
                })
        });

    });

});
