const util = require('util');
const _ = require('lodash');
const sprintf = require('sprintf-js').sprintf;
const Promise = require('bluebird');
const Client = require('ssh2').Client;

const mixins = require('./mixins');
const fs = require("fs");
const _path = require("path");

/**
 *
 * @param options {object}
 * @param options.host {string}
 * @param options.port {number}
 * @param options.path {string}
 * @param options.url {string}
 * @param options.password {string}
 * @param options.db {string}
 * @param options.tls {object}
 * @param options.prefix {string}
 * @constructor
 */


var Ssh2Client = function (options) {
    var instance = this;

    instance._host = _.get(options, 'host');
    instance._port = _.get(options, 'port', 22);
    instance._username = _.get(options, 'username');
    instance._password = _.get(options, 'password');
    instance._privateKey = _.get(options, 'privateKey');
    instance._remoteDirectory = _.get(options, 'remoteDirectory', _path.resolve(process.cwd(), 'files'));
    instance._localDirectory = _.get(options, 'localDirectory', _path.resolve(process.cwd(), 'files'));
    instance._hostHash = _.get(options, 'hostHash');
    instance._hostVerifier = _.get(options, 'hostVerifier');
    instance._agent = _.get(options, 'agent');
    instance._agentForward = _.get(options, 'agentForward');
    instance._passphrase = _.get(options, 'passphrase');
    instance._localHostname = _.get(options, 'localHostname');
    instance._localUsername = _.get(options, 'localUsername');
    instance._keepaliveInterval = _.get(options, 'keepaliveInterval');
    instance._keepaliveCountMax = _.get(options, 'keepaliveCountMax');
    instance._readyTimeout = _.get(options, 'readyTimeout');
    instance._compress = _.get(options, 'compress');
    instance._debug = _.get(options, 'debug');


    if (_.isNil(instance._host)) {
        throw new Error('Missing parameter: host');
    }

    if (_.isNil(instance._port)) {
        throw new Error('Missing parameter: port');
    }

    if (_.isNil(instance._username)) {
        throw new Error('Missing parameter: username');
    }

    if (!_.isNil(instance._privateKey)) {
        if (!_.isBuffer(instance._privateKey)) {
            if (!_.isString(instance._privateKey)) {
                throw new Error('Invalid parameter: privateKey');
            }
            instance._privateKey = fs.readFileSync(_path.resolve(process.cwd(), instance._privateKey));
        }
    }

    if (_.isNil(instance._password) && _.isNil(instance._privateKey)) {
        throw new Error('Missing parameters: password or privateKey');
    }
};

/**
 *
 * @returns {ssh2.Client}
 * @private
 */
Ssh2Client.prototype._connect = function () {
    var instance = this;
    if (!_.isNil(instance._client)) {
        return Promise.resolve(instance._client);
    } else {
        return new Promise(function (resolve, reject) {
            try {
                var client = new Client();
                client.once('ready', function () {
                    instance._client = client;
                    resolve(client);
                });

                client.once('error', function (err) {
                    reject(err);
                });

                client.once('end', function () {
                    instance._client = null;
                });

                client.once('close', function () {
                    instance._client = null;
                });


                client.connect({
                    host: instance._host,
                    port: instance._port,
                    username: instance._username,
                    password: instance._password,
                    privateKey: instance._privateKey,
                    remoteDirectory: instance._remoteDirectory,
                    localDirectory: instance._localDirectory,
                    hostHash: instance._hostHash,
                    hostVerifier: instance._hostVerifier,
                    agent: instance._agent,
                    agentForward: instance._agentForward,
                    passphrase: instance._passphrase,
                    localHostname: instance._localHostname,
                    localUsername: instance._localUsername,
                    keepaliveInterval: instance._keepaliveInterval,
                    keepaliveCountMax: instance._keepaliveCountMax,
                    readyTimeout: instance._readyTimeout,
                    compress: instance._compress,
                    debug: instance._debug
                });

            } catch (err) {
                reject(err);
            }
        });
    }
};

/**
 * Ends the SSH2 connection
 */
Ssh2Client.prototype.end = function () {
    var instance = this;
    var client = instance._client;
    if (!_.isNil(client)) {
        client.end();
    }
};

/**
 * @member {Sftp} sftp
 * @memberof Ssh2Client
 * @instance
 */
_.each(mixins, function (mixin, mixinKey) {
    Object.defineProperty(Ssh2Client.prototype, mixinKey, {
        get: function () {
            var instance = this;
            var _mixinKey = '_' + mixinKey;
            if (!_.has(instance, _mixinKey)) {
                _.set(instance, _mixinKey, new mixin(instance));
            }
            return _.get(instance, _mixinKey);
        }
    });
});

module.exports = Ssh2Client;



