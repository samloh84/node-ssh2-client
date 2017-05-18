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
const Ssh2ClientUtil = require('../../lib/Ssh2ClientUtil');
const fs = require('fs');
const _path = require('path');
const _ = require('lodash');
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

describe("Ssh2ClientUtil", function () {

    beforeEach(function () {
        var variables = this;
        var ssh2Client = variables.ssh2Client = Ssh2ClientUtilTestUtil.createSsh2ClientUtil();


        return ssh2Client.connect();
    })

    describe("exec()", function () {
        it("should exec the command uptime", function () {
            var variables = this;
            var ssh2Client = variables.ssh2Client;

            return ssh2Client.exec({command: 'uptime'})
                .should.be.fulfilled
                .then(function (stream) {
                    return Ssh2ClientUtil.consumeChannel(stream);
                })
                .then(function (output) {
                    console.log(util.inspect(output, {depth: null}));
                })
        });

    });

});
