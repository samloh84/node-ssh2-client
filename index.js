module.exports = require('./lib');
const _ = require('lodash');
const sprintf = require('sprintf-js').sprintf;
const Promise = require('bluebird');
const Client = require('ssh2').Client;
const _path = require('path');
const fs = require('fs');



/**
 *
 * @param sftpClient
 * @param callback
 * @constructor
 */
var SftpClientWrapper = function (sftpClient, callback) {
    var instance = this;
    var client = instance._client = new Client();

    client
        .on('ready', function () {
            client.sftp(function (err, sftp) {
                if (err) {
                    callback(err);
                } else {
                    instance._sftp = sftp;
                    callback(null, instance);
                }
            });
        })
        .connect({
            host: sftpClient._host,
            username: sftpClient._username,
            port: sftpClient._port,
            password: sftpClient._password,
            privateKey: sftpClient._privateKey
        });
};

/**
 *
 * @param promise
 * @returns {*}
 */
SftpClientWrapper.prototype.execute = function (promise) {
    var instance = this;
    return Promise.resolve(promise(instance._sftp));
};

/**
 *
 */
SftpClientWrapper.prototype.end = function () {
    var instance = this;
    instance._client.end();
};


/**
 *
 * @param options
 * @param options.host
 * @param options.port
 * @param options.username
 * @param options.password
 * @param options.privateKey
 * @param options.localDirectory
 * @param options.remoteDirectory
 * @constructor
 */
var SftpClient = function (options) {
    var instance = this;

    if (_.isNil(options)) {
        options = {};
    }

    instance._host = _.get(options, 'host');
    instance._port = _.get(options, 'port', 22);
    instance._username = _.get(options, 'username');
    instance._password = _.get(options, 'password');
    instance._privateKey = _.get(options, 'privateKey');
    instance._remoteDirectory = _.get(options, 'remoteDirectory');

    if (_.isNil(instance._host)) {
        throw new Error('Missing parameter: host');
    }

    if (_.isNil(instance._port)) {
        throw new Error('Missing parameter: port');
    }

    if (_.isNil(instance._username)) {
        throw new Error('Missing parameter: username');
    }

    if (!_.isNil(instance._privateKey)) {
        if (!_.isBuffer(instance._privateKey)) {
            if (!_.isString(instance._privateKey)) {
                throw new Error('Invalid parameter: privateKey');
            }
            instance._privateKey = fs.readFileSync(path.resolve(process.cwd(), instance._privateKey));
        }
    }

    if (_.isNil(instance._password) && _.isNil(instance._privateKey)) {
        throw new Error('Missing parameters: password or privateKey');
    }


    instance._poolMax = _.get(options, 'poolMax', 10);
    instance._poolMin = _.get(options, 'poolMin', 2);
    instance._idleTimeoutMillis = _.get(options, 'idleTimeoutMillis', 30000);
    instance._log = _.get(options, 'log', true);

    instance._pool = new Pool({
        name: 'sftp',
        create: function (callback) {
            new SftpClientWrapper(instance, callback);

        },
        destroy: function (client) {
            client.end();
        },
        max: instance._poolMax,
        min: instance._poolMin,
        idleTimeoutMillis: instance._idleTimeoutMillis,
        log: true
    });


};


/**
 *
 * @param promise
 */
SftpClient.prototype.execute = function (promise) {
    const instance = this;

    return new Promise(function (resolve, reject) {
        var client = new Client();

        var pool = instance._pool;

        pool.acquire(function (err, wrapper) {
            if (err) {
                reject(err);
            }

            wrapper.execute(promise)
                .then(resolve)
                .finally(function () {
                    pool.release(wrapper);
                });
        });
    });
};

var SftpClientOperations = SftpClientOperations = {};

/**
 *
 * @param options
 * @param options.remotePath
 * @param options.localPath
 * @returns {Function}
 */
SftpClientOperations.get = function (options) {
    const instance = this;

    if (_.isNil(options)) {
        options = {};
    }


    var remotePath = _.get(options, 'remotePath');
    var localPath = _.get(options, 'localPath');


    remotePath = path.resolve(instance._remoteDirectory, remotePath);
    localPath = path.resolve(process.cwd(), config.localDirectory, localPath);


    return function (sftp) {
        return new Promise(function (resolve, reject) {
            sftp.fastGet(remotePath, localPath, {}, function (err) {
                if (err) {
                    return reject(err);
                }

                resolve();
            })
        });
    };
};


/**
 *
 * @param options
 * @param options.remotePath
 * @param options.localPath
 */
SftpClient.prototype.get = function (options) {
    const instance = this;

    if (_.isNil(options)) {
        options = {};
    }

    return instance.execute(instance.ops.get(options));
};


/**
 *
 * @param options
 * @param options.remotePath
 * @param options.localPath
 * @returns {Function}
 */
SftpClientOperations.put = function (options) {
    const instance = this;

    if (_.isNil(options)) {
        options = {};
    }


    var localPath = _.get(options, 'localPath');
    var remotePath = _.get(options, 'remotePath');

    remotePath = path.resolve(instance._remoteDirectory, remotePath);
    localPath = path.resolve(process.cwd(), config.localDirectory, localPath);


    return function (sftp) {
        return new Promise(function (resolve, reject) {
            sftp.fastPut(localPath, remotePath, {}, function (err) {
                if (err) {
                    return reject(err);
                }

                resolve();
            })
        });
    };

};


/**
 *
 * @param options
 * @param options.remotePath
 * @param options.localPath
 */
SftpClient.prototype.put = function (options) {
    const instance = this;

    if (_.isNil(options)) {
        options = {};
    }

    return instance.execute(instance.ops.put(options));
};

/**
 *
 * @param options
 * @param options.path
 * @returns {Function}
 */
SftpClientOperations.readdir = function (options) {
    if (_.isNil(options)) {
        options = {};
    }

    var dirPath = _.get(options, 'path');

    return function (sftp) {
        return new Promise(function (resolve, reject) {
            sftp.readdir(dirPath, function (err, list) {
                if (err) {
                    return reject(err);
                }

                resolve(list);
            })

        });

    };
};


/**
 *
 * @param options
 * @param options.path
 */
SftpClient.prototype.readdir = function (options) {
    const instance = this;

    if (_.isNil(options)) {
        options = {};
    }

    return instance.execute(instance.ops.readdir(options));
};


/**
 *
 * @param options
 * @param options.path
 * @param options.uid
 * @param options.gid
 * @returns {Function}
 */
SftpClientOperations.chown = function (options) {
    if (_.isNil(options)) {
        options = {};
    }

    var filePath = _.get(options, 'path');
    var uid = _.get(options, 'uid');
    var gid = _.get(options, 'gid');


    return function (sftp) {
        return new Promise(function (resolve, reject) {
            sftp.chown(filePath, uid, gid, function (err) {
                if (err) {
                    return reject(err);
                }

                resolve();
            })

        });

    };
};


/**
 *
 * @param options
 * @param options.path
 * @param options.uid
 * @param options.gid
 */
SftpClient.prototype.chown = function (options) {
    const instance = this;

    if (_.isNil(options)) {
        options = {};
    }

    return instance.execute(instance.ops.chown(options));
};


/**
 *
 * @param options
 * @param options.path
 * @param options.mode
 * @returns {Function}
 */
SftpClientOperations.chmod = function (options) {
    if (_.isNil(options)) {
        options = {};
    }

    var filePath = _.get(options, 'path');
    var mode = _.get(options, 'mode');

    return function (sftp) {
        return new Promise(function (resolve, reject) {
            sftp.chmod(filePath, mode, function (err) {
                if (err) {
                    return reject(err);
                }

                resolve();
            })

        });

    };
};


/**
 *
 * @param options
 * @param options.path
 * @param options.mode
 */
SftpClient.prototype.chmod = function (options) {
    const instance = this;

    if (_.isNil(options)) {
        options = {};
    }

    return instance.execute(instance.ops.chmod(options));
};


/**
 *
 * @param options
 * @param options.path
 * @returns {Function}
 */
SftpClientOperations.unlink = function (options) {
    if (_.isNil(options)) {
        options = {};
    }

    var filePath = _.get(options, 'path');

    return function (sftp) {
        return new Promise(function (resolve, reject) {
            sftp.unlink(filePath, function (err) {
                if (err) {
                    return reject(err);
                }

                resolve();
            })

        });

    };
};


/**
 *
 * @param options
 * @param options.path
 */
SftpClient.prototype.unlink = function (options) {
    const instance = this;

    if (_.isNil(options)) {
        options = {};
    }

    return instance.execute(instance.ops.unlink(options));
};


/**
 *
 * @param options
 * @param options.srcPath
 * @param options.destPath
 * @returns {Function}
 */
SftpClientOperations.rename = function (options) {
    if (_.isNil(options)) {
        options = {};
    }

    var srcPath = _.get(options, 'srcPath');
    var destPath = _.get(options, 'destPath');


    return function (sftp) {
        return new Promise(function (resolve, reject) {
            sftp.rename(srcPath, destPath, function (err) {
                if (err) {
                    return reject(err);
                }

                resolve();
            })

        });

    };
};


/**
 *
 * @param options
 * @param options.srcPath
 * @param options.destPath
 */
SftpClient.prototype.rename = function (options) {
    const instance = this;

    if (_.isNil(options)) {
        options = {};
    }

    return instance.execute(instance.ops.rename(options));
};


/**
 *
 * @param options
 * @param options.path
 * @returns {Function}
 */
SftpClientOperations.mkdir = function (options) {
    if (_.isNil(options)) {
        options = {};
    }

    var dirPath = _.get(options, 'path');


    return function (sftp) {
        return new Promise(function (resolve, reject) {
            sftp.mkdir(dirPath, function (err) {
                if (err) {
                    return reject(err);
                }

                resolve();
            })

        });

    };
};


/**
 *
 * @param options
 * @param options.path
 */
SftpClient.prototype.mkdir = function (options) {
    const instance = this;

    if (_.isNil(options)) {
        options = {};
    }

    return instance.execute(instance.ops.mkdir(options));
};


/**
 *
 * @param options
 * @param options.path
 * @returns {Function}
 */
SftpClientOperations.rmdir = function (options) {
    if (_.isNil(options)) {
        options = {};
    }

    var dirPath = _.get(options, 'path');


    return function (sftp) {
        return new Promise(function (resolve, reject) {
            sftp.rmdir(dirPath, function (err) {
                if (err) {
                    return reject(err);
                }

                resolve();
            })

        });

    };
};


/**
 *
 * @param options
 * @param options.path
 */
SftpClient.prototype.rmdir = function (options) {
    const instance = this;

    if (_.isNil(options)) {
        options = {};
    }

    return instance.execute(instance.ops.rmdir(options));
};


/**
 *
 * @param options
 * @param options.path
 * @returns {Function}
 */
SftpClientOperations.stat = function (options) {
    if (_.isNil(options)) {
        options = {};
    }

    var dirPath = _.get(options, 'path');

    return function (sftp) {
        return new Promise(function (resolve, reject) {
            sftp.stat(dirPath, function (err, stats) {
                if (err) {
                    return reject(err);
                }

                resolve(stats);
            })

        });

    };
};

/**
 *
 * @param options
 * @param options.path
 */
SftpClient.prototype.stat = function (options) {
    const instance = this;

    if (_.isNil(options)) {
        options = {};
    }

    return instance.execute(instance.ops.stat(options));
};

/**
 *
 * @param options
 * @param options.path
 * @returns {Function}
 */
SftpClientOperations.realpath = function (options) {
    if (_.isNil(options)) {
        options = {};
    }

    var dirPath = _.get(options, 'path');

    return function (sftp) {
        return new Promise(function (resolve, reject) {
            sftp.realpath(dirPath, function (err, absolutePath) {
                if (err) {
                    return reject(err);
                }

                resolve(absolutePath);
            })

        });

    };
};


/**
 *
 * @param options
 * @param options.path
 */
SftpClient.prototype.realpath = function (options) {
    const instance = this;

    if (_.isNil(options)) {
        options = {};
    }

    return instance.execute(instance.ops.path(options));
};


module.exports = SftpClient;
