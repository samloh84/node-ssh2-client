const _ = require('lodash');
const Promise = require('bluebird');

/**
 * @memberOf SftpClient#
 * @function createWriteStream
 *
 * @param options
 * @param options.localPath
 * @param options.remotePath
 * @param options.concurrency
 * @param options.chunkSize
 * @param options.step
 *
 * @return {Promise<WritableStream>}
 * @see {@link https://github.com/mscdex/ssh2-streams/blob/master/SFTPStream.md#sftpstream-methods|SFTPStream methods}
 */
var createWriteStream = function (options) {
    var instance = this;
    return instance._getSftpWrapper()
        .then(function (sftpWrapper) {

            return new Promise(function (resolve, reject) {

                try {
                    var path = _.get(options, 'path');
                    var flags = _.get(options, 'flags');
                    var encoding = _.get(options, 'encoding');
                    var mode = _.get(options, 'mode');
                    var autoClose = _.get(options, 'autoClose');
                    var start = _.get(options, 'start');

                    var createWriteStreamArgs = [path];

                    var createWriteStreamOptions = {
                        flags: flags,
                        encoding: encoding,
                        mode: mode,
                        autoClose: autoClose,
                        start: start
                    };

                    createWriteStreamOptions = _.omitBy(createWriteStreamOptions, _.isUndefined);
                    if (!_.isEmpty(createWriteStreamOptions)) {
                        createWriteStreamArgs.push(createWriteStreamOptions);
                    }

                    return resolve(sftpWrapper.createWriteStream.apply(sftpWrapper, createWriteStreamArgs));


                } catch (err) {
                    return reject(err);
                }

            });
        })


};

module.exports = createWriteStream;