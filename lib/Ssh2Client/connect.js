/**
 * @memberOf Ssh2Client#
 * @function connect
 *
 * @return {undefined}
 *
 */
module.exports = connect = function () {
    var instance = this;
    return instance._connect()
        .then(function () {
            return undefined;
        })
};






