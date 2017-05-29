const Promise = require('bluebird');
const _ = require('lodash');

/**
 * @typedef {Object} Ssh2ClientShellPseudoTtySettings
 * @property {Number} rows
 * @property {Number} cols
 * @property {Number} height
 * @property {Number} width
 * @property {String} term
 *
 */

/**
 * @typedef {Object} Ssh2ClientShellX11Settings
 * @property {Boolean} single
 * @property {Number} screen
 *
 */


/**
 * @memberOf Ssh2Client#
 * @function subsys
 *
 * @param options
 * @param {Ssh2ClientShellPseudoTtySettings|Boolean} options.window
 * @param {Object} options.env
 * @param {Ssh2ClientShellX11Settings|Boolean} options.x11
 * @return {Promise<Channel>}
 */
var subsys = function (options) {
    var instance = this;

    var fnName = 'subsys';

    var fnArgsCallback = function (resolve, reject) {
        var subsystem = _.get(options, 'subsystem');

        var callback = function (err, stream) {
            if (!_.isNil(err)) {
                return reject(err);
            }

            return resolve(stream);
        };

        return [subsystem, callback];
    };

    return instance._call(fnName, fnArgsCallback);

};

module.exports = subsys;