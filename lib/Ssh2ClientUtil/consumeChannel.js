const Promise = require('bluebird');

/**
 * @memberOf Ssh2ClientUtil.
 * @function consumeChannel
 *
 * @param stream
 * @return {Promise<{stdout:Buffer, stderr:Buffer}>}
 */
var consumeChannel = function (stream) {
    return new Promise(function (resolve, reject) {

        try {
            var stdoutChunks = [];
            var stderrChunks = [];

            stream.on('close', function () {

                var stdout = Buffer.concat(stdoutChunks).toString('utf8');
                var stderr = Buffer.concat(stderrChunks).toString('utf8');

                return resolve({stdout: stdout, stderr: stderr});
            });

            stream.on('data', function (chunk) {
                stdoutChunks.push(chunk);
            });

            stream.stderr.on('data', function (chunk) {
                stderrChunks.push(chunk);
            });


            stream.on('error', function (err) {
                return reject(err);
            });

        } catch (err) {
            return reject(err);
        }


    });
};

module.exports = consumeChannel;