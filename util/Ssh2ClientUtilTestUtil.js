const fs = require('fs');
const _path = require('path');
const _ = require('lodash');
const Ssh2ClientUtil = require('../lib/Ssh2ClientUtil');

const SSH2_CLIENT_UTIL_TEST_HOST = _.get(process, 'env.SSH2_CLIENT_UTIL_TEST_HOST', 'vagrant');
const SSH2_CLIENT_UTIL_TEST_USERNAME = _.get(process, 'env.SSH2_CLIENT_UTIL_TEST_USERNAME', 'vagrant');
const SSH2_CLIENT_UTIL_TEST_PASSWORD = _.get(process, 'env.SSH2_CLIENT_UTIL_TEST_PASSWORD', 'vagrant');


var Ssh2ClientUtilTestUtil = {};


Ssh2ClientUtilTestUtil.createSsh2ClientUtil = function () {


    return new Ssh2ClientUtil({
        host: SSH2_CLIENT_UTIL_TEST_HOST,
        username: SSH2_CLIENT_UTIL_TEST_USERNAME,
        password: SSH2_CLIENT_UTIL_TEST_PASSWORD
    });
}

module.exports = Ssh2ClientUtilTestUtil;