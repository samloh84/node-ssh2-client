const Promise = require('bluebird');
const _ = require('lodash');
const Client = require('ssh2').Client;

/**
 * @memberOf Ssh2ClientUtil#
 * @function _connect
 *
 * @return {Promise<Client>}
 * @private
 */
var _connect = function () {
    var instance = this;

    return new Promise(function (resolve, reject) {
        try {

            var options = instance._options;
            var client = instance._client;

            if (_.isNil(instance._client)) {
                client = instance._client = new Client();

                var connectErrorListener = function (err) {
                    return reject(err);
                };

                client.on('error', connectErrorListener);

                client.on('ready', function () {
                    client.removeListener('error', connectErrorListener);
                    return resolve(client);
                });


                client.connect(options);

            } else {
                return resolve(client);
            }

        } catch (err) {
            return reject(err);
        }
    });

};

module.exports = _connect;