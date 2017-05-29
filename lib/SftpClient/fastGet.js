const _ = require('lodash');
const Promise = require('bluebird');

/**
 * @memberOf SftpClient#
 * @function fastGet
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
var fastGet = function (options) {
    var instance = this;
    var sftpWrapper = instance._sftpWrapper;


    return new Promise(function (resolve, reject) {

        try {
            var remotePath = _.get(options, 'remotePath');
            var localPath = _.get(options, 'localPath');
            var concurrency = _.get(options, 'concurrency');
            var chunkSize = _.get(options, 'chunkSize');
            var step = _.get(options, 'step');

            var fastGetArgs = [remotePath, localPath];


            var fastGetOptions = {
                concurrency: concurrency,
                chunkSize: chunkSize,
                step: step
            };

            fastGetOptions = _.omitBy(fastGetOptions, _.isUndefined);
            if (!_.isEmpty(fastGetOptions)) {
                fastGetArgs.push(fastGetOptions);
            }

            var callback = function (err) {
                if (!_.isNil(err)) {
                    return reject(err);
                }

                return resolve();
            };

            fastGetArgs.push(callback);

            sftpWrapper.fastGet.apply(sftpWrapper, fastGetArgs);


        } catch (err) {
            return reject(err);
        }

    });


};

module.exports = fastGet;