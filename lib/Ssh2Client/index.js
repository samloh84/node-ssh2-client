const _ = require('lodash');

/**
 * @callback Ssh2ClientHostVerifierCallback
 * @param {String} hashedKey
 * @param {Ssh2ClientHostVerifierCallbackCallback} callback - Call callback() with true or false for async verification.
 *
 */

/**
 * @callback Ssh2ClientHostVerifierCallbackCallback
 * @param {Boolean} accept
 *
 */

/**
 * @callback Ssh2ClientDebugCallback
 * @param {String} message
 *
 */

/**
 * @typedef {Object} Ssh2ClientAlgorithmsOptions
 * @property {String[]} kex - Key exchange algorithms
 * @property {String[]} cipher - Ciphers
 * @property {String[]} serverHostKey - Server host key formats
 * @property {String[]} hmac - (H)MAC algorithms
 * @property {String[]} compress - Compression algorithms
 *
 */


/**
 *
 * @param {Object} options
 * @param {String} options.host
 * @param {Number} options.port
 * @param {Boolean} options.forceIPv4
 * @param {Boolean} options.forceIPv6
 * @param {String} options.hostHash - Can be either 'md5' or 'sha1'
 * @param {Ssh2ClientHostVerifierCallback} options.hostVerifier
 * @param {String} options.username
 * @param {String} options.password
 * @param {String} options.agent
 * @param {Boolean} options.agentForward
 * @param {String|Buffer} options.privateKey
 * @param {String} options.passphrase
 * @param {String} options.localHostname
 * @param {String} options.localUsername
 * @param {Boolean} options.tryKeyboard
 * @param {Number} options.keepaliveInterval
 * @param {Number} options.keepaliveCountMax
 * @param {Number} options.readyTimeout
 * @param {ReadableStream} options.sock
 * @param {Boolean} options.strictVendor
 * @param {Ssh2ClientAlgorithmsOptions} options.algorithms
 * @param {Boolean} options.compress
 * @param {Boolean|Ssh2ClientDebugCallback} options.debug
 *
 * @class Ssh2Client
 */
var Ssh2Client = function (options) {

    var instance = this;

    var host = _.get(options, 'host');
    var port = _.get(options, 'port');
    var forceIPv4 = _.get(options, 'forceIPv4');
    var forceIPv6 = _.get(options, 'forceIPv6');
    var hostHash = _.get(options, 'hostHash');
    var hostVerifier = _.get(options, 'hostVerifier');
    var username = _.get(options, 'username');
    var password = _.get(options, 'password');
    var agent = _.get(options, 'agent');
    var agentForward = _.get(options, 'agentForward');
    var privateKey = _.get(options, 'privateKey');
    var passphrase = _.get(options, 'passphrase');
    var localHostname = _.get(options, 'localHostname');
    var localUsername = _.get(options, 'localUsername');
    var tryKeyboard = _.get(options, 'tryKeyboard');
    var keepaliveInterval = _.get(options, 'keepaliveInterval');
    var keepaliveCountMax = _.get(options, 'keepaliveCountMax');
    var readyTimeout = _.get(options, 'readyTimeout');
    var sock = _.get(options, 'sock');
    var strictVendor = _.get(options, 'strictVendor');
    var algorithms = _.get(options, 'algorithms');
    var compress = _.get(options, 'compress');
    var debug = _.get(options, 'debug');


    if (_.isBoolean(debug)) {
        if (debug) {
            debug = function (message) {
                return console.log(message);
            }
        } else {
            debug = undefined;
        }
    }

    var connectOptions = {
        host: host,
        port: port,
        forceIPv4: forceIPv4,
        forceIPv6: forceIPv6,
        hostHash: hostHash,
        hostVerifier: hostVerifier,
        username: username,
        password: password,
        agent: agent,
        agentForward: agentForward,
        privateKey: privateKey,
        passphrase: passphrase,
        localHostname: localHostname,
        localUsername: localUsername,
        tryKeyboard: tryKeyboard,
        keepaliveInterval: keepaliveInterval,
        keepaliveCountMax: keepaliveCountMax,
        readyTimeout: readyTimeout,
        sock: sock,
        strictVendor: strictVendor,
        algorithms: algorithms,
        compress: compress,
        debug: debug
    };

    connectOptions = _.omitBy(connectOptions, _.isUndefined);

    instance._options = connectOptions;
};


Ssh2Client.consumeChannel = require('./consumeChannel');

_.assign(Ssh2Client.prototype, {
    _call: require('./_call'),
    _connect: require('./_connect'),
    connect: require('./connect'),
    consumeChannel: require('./consumeChannel'),
    end: require('./end'),
    exec: require('./exec'),
    forwardIn: require('./forwardIn'),
    forwardOut: require('./forwardOut'),
    getSftpClient: require('./getSftpClient'),
    openssh_forwardInStreamLocal: require('./openssh_forwardInStreamLocal'),
    openssh_forwardOutStreamLocal: require('./openssh_forwardOutStreamLocal'),
    openssh_noMoreSessions: require('./openssh_noMoreSessions'),
    openssh_unforwardInStreamLocal: require('./openssh_unforwardInStreamLocal'),
    sftp: require('./sftp'),
    shell: require('./shell'),
    subsys: require('./subsys'),
    unforwardIn: require('./unforwardIn')
});


module.exports = Ssh2Client;