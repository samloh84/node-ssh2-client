const Promise = require('bluebird');
const _ = require('lodash');

/**
 * @memberOf Ssh2Client#
 * @function forwardOut
 *
 * @param options
 * @param {remoteAddr} options.remoteAddr
 * @param {remotePort} options.remotePort
 * @return {Promise<Number>} remotePort
 */
var forwardOut = function (options) {
    var instance = this;

    var fnName = 'forwardOut';

    var fnArgsCallback = function (resolve, reject) {
        var srcIP = _.get(options, 'srcIP');
        var srcPort = _.get(options, 'srcPort');
        var dstIP = _.get(options, 'dstIP');
        var dstPort = _.get(options, 'dstPort');

        var callback = function (err, stream) {
            if (!_.isNil(err)) {
                return reject(err);
            }

            return resolve(stream);
        };


        return [srcIP, srcPort, dstIP, dstPort, callback];
    };

    return instance._call(fnName, fnArgsCallback);

};

module.exports = forwardOut;