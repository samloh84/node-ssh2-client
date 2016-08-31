const Ssh2Client = require('./Ssh2Client');
const _ = require('lodash');
const sprintf = require('sprintf-js').sprintf;
const Promise = require('bluebird');
const Pool = require('generic-pool').Pool;


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
 * @param options.poolMin {number}
 * @param options.poolMax {number}
 * @param options.idleTimeoutMillis {number}
 * @param options.log {boolean|function}
 * @constructor
 * @mixes {Strings}
 */
var Ssh2ClientPool = function (options) {
    var instance = this;

    instance._poolMax = _.get(options, 'poolMax', 10);
    instance._poolMin = _.get(options, 'poolMin', 2);
    instance._idleTimeoutMillis = _.get(options, 'idleTimeoutMillis', 30000);
    instance._log = _.get(options, 'log', true);

    instance._pool = new Pool({
        name: 'Ssh2',
        create: function (callback) {
            try {
                var client = new Ssh2Client(options);
                callback(null, client);

            } catch (err) {
                callback(err);
            }

        },
        destroy: function (client) {
            client.quit();
        },
        max: instance._poolMax,
        min: instance._poolMin,
        idleTimeoutMillis: instance._idleTimeoutMillis,
        log: instance._log
    });
};

/**
 *
 */
Ssh2ClientPool.prototype.shutdown = function () {
    var instance = this;
    var pool = instance._pool;
    pool.drain(function () {
        pool.destroyAllNow();
    });
};

_.each(Ssh2Client.prototype, function (fn, fnKey) {
    if (!_.isFunction(fn)) {
        return;
    }

    Ssh2ClientPool.prototype[fnKey] = function () {
        var instance = this;
        var pool = instance._pool;
        var args = Array.prototype.slice.call(arguments);

        return new Promise(function (resolve, reject) {
            try {
                pool.acquire(function (err, client) {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(fn.apply(client, args));
                });
            } catch (err) {
                return reject(err);
            }
        })
    };
});

module.exports = Ssh2ClientPool;
