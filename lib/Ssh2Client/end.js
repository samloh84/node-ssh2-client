const Promise = require('bluebird');
const _ = require('lodash');

/**
 * @memberOf Ssh2Client#
 * @function end
 *
 * @return {Promise<undefined>}
 */
var end = function () {
    var instance = this;

    return new Promise(function (resolve, reject) {
        try {
            if (!_.isNil(instance._client)) {
                instance._client.end();
                instance._client = null;
            }
            return resolve();
        } catch (err) {
            return reject(err);
        }
    });

};

module.exports = end;