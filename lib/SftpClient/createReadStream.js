const _ = require('lodash');
const Promise = require('bluebird');

/**
 * @memberOf SftpClient#
 * @function createReadStream
 *
 * @param options
 * @param options.localPath
 * @param options.remotePath
 * @param options.concurrency
 * @param options.chunkSize
 * @param options.step
 *
 * @return {Promise<ReadableStream>}
 * @see {@link https://github.com/mscdex/ssh2-streams/blob/master/SFTPStream.md#sftpstream-methods|SFTPStream methods}
 */
var createReadStream = function (options) {
    var instance = this;
    return instance._getSftpWrapper()
        .then(function (sftpWrapper) {
            return new Promise(function (resolve, reject) {
                try {
                    var path = _.get(options, 'path');
                    var flags = _.get(options, 'flags');
                    var encoding = _.get(options, 'encoding');
                    var handle = _.get(options, 'handle');
                    var mode = _.get(options, 'mode');
                    var autoClose = _.get(options, 'autoClose');
                    var start = _.get(options, 'start');
                    var end = _.get(options, 'end');

                    var createReadStreamArgs = [path];


                    var createReadStreamOptions = {
                        flags: flags,
                        encoding: encoding,
                        handle: handle,
                        mode: mode,
                        autoClose: autoClose,
                        start: start,
                        end: end
                    };

                    createReadStreamOptions = _.omitBy(createReadStreamOptions, _.isUndefined);
                    if (!_.isEmpty(createReadStreamOptions)) {
                        createReadStreamArgs.push(createReadStreamOptions);
                    }

                    return resolve(sftpWrapper.createReadStream.apply(sftpWrapper, createReadStreamArgs));


                } catch (err) {
                    return reject(err);
                }

            });
        })
};

module.exports = createReadStream;