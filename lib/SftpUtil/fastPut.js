const _ = require('lodash');
const Promise = require('bluebird');

/**
 * @memberOf SftpUtil#
 * @function fastPut
 *
 * @param options
 * @param options.localPath
 * @param options.remotePath
 * @param options.concurrency
 * @param options.chunkSize
 * @param options.step
 *
 * @return {Promise<undefined>}
 * @see {@link https://github.com/mscdex/ssh2-streams/blob/master/SFTPStream.md#sftpstream-methods|SFTPStream methods}
 */
var fastPut = function (options) {
    var instance = this;
    var sftpWrapper = instance._sftpWrapper;

    return new Promise(function (resolve, reject) {

        try {
            var localPath = _.get(options, 'localPath');
            var remotePath = _.get(options, 'remotePath');
            var concurrency = _.get(options, 'concurrency');
            var chunkSize = _.get(options, 'chunkSize');
            var step = _.get(options, 'step');

            var fastPutArgs = [localPath, remotePath];


            var fastPutOptions = {
                concurrency: concurrency,
                chunkSize: chunkSize,
                step: step
            };

            fastPutOptions = _.omitBy(fastPutOptions, _.isUndefined);
            if (!_.isEmpty(fastPutOptions)) {
                fastPutArgs.push(fastPutOptions);
            }

            var callback = function (err) {
                if (!_.isNil(err)) {
                    return reject(err);
                }

                return resolve();
            };

            fastPutArgs.push(callback);

            sftpWrapper.fastPut.apply(sftpWrapper, fastPutArgs);


        } catch (err) {
            return reject(err);
        }

    });


};

module.exports = fastPut;