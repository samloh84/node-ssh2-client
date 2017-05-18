const fs = require('fs');
const _path = require('path');
const _ = require('lodash');
const Ssh2ClientUtil = require('../lib/Ssh2ClientUtil');
var Ssh2ClientUtilTestUtil = {};

Ssh2ClientUtilTestUtil.createSsh2ClientUtil = function () {
    return new Ssh2ClientUtil({host: 'localhost', username: 'vagrant', password: 'vagrant'});
}

module.exports = Ssh2ClientUtilTestUtil;