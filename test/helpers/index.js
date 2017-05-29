const _ = require('lodash');

const mocha = global.mocha = require('mocha');
global.describe = mocha.describe;
global.it = mocha.it;
global.before = mocha.before;
global.beforeEach = mocha.beforeEach;
global.after = mocha.after;
global.afterEach = mocha.afterEach;

const chai = global.chai = require("chai");
const Promise = require('bluebird');
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

global.expect = chai.expect;
global.should = chai.should;

const TestUtil = global.TestUtil = require('./TestUtil');
