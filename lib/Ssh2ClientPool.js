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



Ssh2ClientPool.prototype._acquire = function () {
    var instance = this;
    var pool = instance._pool;
    return new Promise(function (resolve, reject) {
        try {
            return pool._acquire(function (err, client) {
                if (err) {
                    return reject(err);
                }
                return resolve(client);
            })
        } catch (err) {
            return reject(err);
        }
    })
};

Ssh2ClientPool.prototype._release = function (client) {
    var instance = this;
    var pool = instance._pool;
    pool.release(client);
};


_.each(Ssh2Client.prototype, function (fn, fnKey) {
    if (!_.isFunction(fn)) {
        return;
    }

    Ssh2ClientPool.prototype[fnKey] = function () {
        var instance = this;
        var args = Array.prototype.slice.call(arguments);

        return instance._acquire()
            .then(function (client) {
                return Promise.resolve(fn.apply(client, args))
                    .finally(function () {
                        return instance._release(client);
                    });
            });
    };
});

module.exports = Ssh2ClientPool;
