const util = require('util');
const _ = require('lodash');
const sprintf = require('sprintf-js').sprintf;
const Promise = require('bluebird');
const _path = require("path");
const stream = require("stream");


/**
 * Ssh2 Sftp Client Commands
 * @see {@link https://github.com/mscdex/ssh2-streams/blob/master/SFTPStream.md}
 *
 */
var Sftp = function (ssh2Client) {
    const instance = this;
    instance._ssh2Client = ssh2Client;
};

/**
 *
 * @returns {Promise.<SFTPStream>}
 * @private
 */
Sftp.prototype._connect = function () {
    const instance = this;
    const ssh2Client = instance._ssh2Client;

    if (!_.isNil(instance._sftp)) {
        return Promise.resolve(instance._sftp);
    } else {
        return ssh2Client._connect()
            .then(function (client) {
                client.once('end', function () {
                    instance._sftp = null;
                });

                client.once('close', function () {
                    instance._sftp = null;
                });

                return new Promise(function (resolve, reject) {
                    try {
                        return client.sftp(function (err, sftp) {
                            if (err) {
                                return reject(err);
                            }
                            instance._sftp = sftp;
                            return resolve(sftp);
                        });
                    } catch (err) {
                        return reject(err);
                    }
                });
            });
    }

};

/**
 * Downloads a file at remotePath to localPath using parallel reads for faster throughput.
 * @param options {object}
 * @param options.remotePath {string}
 * @param options.localPath {string}
 * @param options.concurrency {string}
 * @param options.chunkSize {string}
 * @param options.step {step}
 * @returns {Promise.<undefined>}
 */
Sftp.prototype.fastGet = function (options) {
    const instance = this;
    const ssh2Client = instance._ssh2Client;
    var remotePath = _.get(options, 'remotePath');
    remotePath = _path.resolve(ssh2Client._remoteDirectory, remotePath);
    var localPath = _.get(options, 'localPath');
    localPath = _path.resolve(process.cwd(), ssh2Client._localDirectory, localPath);

    var concurrency = _.get(options, 'concurrency');
    var chunkSize = _.get(options, 'chunkSize');

    /**
     * @callback step
     * @param total_transferred {number}
     * @param chunk {number}
     * @param total {number}
     */
    var step = _.get(options, 'step');

    var fastGetOptions = {
        concurrency: concurrency,
        chunkSize: chunkSize,
        step: step
    };
    fastGetOptions = _.omitBy(fastGetOptions, _.isUndefined);

    return instance._connect()
        .then(function (sftp) {
            return new Promise(function (resolve, reject) {
                try {

                    sftp.fastGet(remotePath, localPath, fastGetOptions, function (err) {
                        if (err) {
                            return reject(err);
                        }
                        return resolve();
                    })
                } catch (err) {
                    return reject(err);
                }
            });
        });
};


/**
 * Uploads a file from localPath to remotePath using parallel reads for faster throughput.
 * @param options {object}
 * @param options.localPath {string}
 * @param options.remotePath {string}
 * @param options.concurrency {string}
 * @param options.chunkSize {string}
 * @param options.step {step}
 * @returns {Promise.<undefined>}
 */
Sftp.prototype.fastPut = function (options) {
    const instance = this;

    const ssh2Client = instance._ssh2Client;
    var remotePath = _.get(options, 'remotePath');
    remotePath = _path.resolve(ssh2Client._remoteDirectory, remotePath);
    var localPath = _.get(options, 'localPath');
    localPath = _path.resolve(process.cwd(), ssh2Client._localDirectory, localPath);

    var concurrency = _.get(options, 'concurrency');
    var chunkSize = _.get(options, 'chunkSize');

    /**
     * @callback step
     * @param total_transferred {number}
     * @param chunk {number}
     * @param total {number}
     */
    var step = _.get(options, 'step');

    var fastPutOptions = {
        concurrency: concurrency,
        chunkSize: chunkSize,
        step: step
    };
    fastPutOptions = _.omitBy(fastPutOptions, _.isUndefined);

    return instance._connect()
        .then(function (sftp) {
            return new Promise(function (resolve, reject) {
                try {

                    sftp.fastPut(localPath, remotePath, fastPutOptions, function (err) {
                        if (err) {
                            return reject(err);
                        }
                        return resolve();
                    })
                } catch (err) {
                    return reject(err);
                }
            });
        });
};

/**
 * Returns a new readable stream for path.
 * @param options {object}
 * @param options.path
 * @param options.flags
 * @param options.encoding
 * @param options.handle
 * @param options.mode
 * @param options.autoClose
 * @param options.start
 * @param options.end
 * @returns {Promise.<ReadStream>}
 */
Sftp.prototype.createReadStream = function (options) {
    const instance = this;
    const ssh2Client = instance._ssh2Client;

    if (_.isString(options)) {
        options = {path: options};
    }

    var path = _.get(options, 'path');
    path = _path.resolve(ssh2Client._remoteDirectory, path);

    var flags = _.get(options, 'flags');
    var encoding = _.get(options, 'encoding');
    var handle = _.get(options, 'handle');
    var mode = _.get(options, 'mode');
    var autoClose = _.get(options, 'autoClose');
    var start = _.get(options, 'start');
    var end = _.get(options, 'end');


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


    return instance._connect()
        .then(function (sftp) {
            return new Promise(function (resolve, reject) {
                try {

                    var readStream = sftp.createReadStream(path, createReadStreamOptions);

                    readStream.once('open', function () {
                        return resolve(readStream);
                    });

                    readStream.once('error', function (err) {
                        return reject(err);
                    });

                } catch (err) {
                    return reject(err);
                }
            });
        });
};

/**
 * Returns a new writable stream for path.
 * @param options {object}
 * @param options.path
 * @param options.flags
 * @param options.encoding
 * @param options.mode
 * @param options.autoClose
 * @returns {Promise.<WriteStream>}
 */
Sftp.prototype.createWriteStream = function (options) {
    const instance = this;
    const ssh2Client = instance._ssh2Client;

    if (_.isString(options)) {
        options = {path: options};
    }

    var path = _.get(options, 'path');
    path = _path.resolve(ssh2Client._remoteDirectory, path);

    var flags = _.get(options, 'flags');
    var encoding = _.get(options, 'encoding');
    var mode = _.get(options, 'mode');
    var autoClose = _.get(options, 'autoClose');

    var createWriteStreamOptions = {
        flags: flags,
        encoding: encoding,
        mode: mode,
        autoClose: autoClose
    };
    createWriteStreamOptions = _.omitBy(createWriteStreamOptions, _.isUndefined);

    return instance._connect()
        .then(function (sftp) {
            return new Promise(function (resolve, reject) {
                try {

                    var writeStream = sftp.createWriteStream(path, createWriteStreamOptions);

                    writeStream.once('open', function () {
                        return resolve(writeStream);
                    });

                    writeStream.once('error', function (err) {
                        return reject(err);
                    });

                } catch (err) {
                    return reject(err);
                }
            });
        });
};


/**
 * Retrieves a directory listing.
 * @param options {object}
 * @param options.path
 * @returns {Promise.<[{}]>}
 */
Sftp.prototype.readdir = function (options) {
    const instance = this;
    const ssh2Client = instance._ssh2Client;
    if (_.isString(options)) {
        options = {path: options};
    }

    var path = _.get(options, 'path');

    path = _path.resolve(ssh2Client._remoteDirectory, path);

    return instance._connect()
        .then(function (sftp) {
            return new Promise(function (resolve, reject) {
                try {
                    sftp.readdir(path, function (err, files) {
                        if (err) {
                            return reject(err);
                        }
                        return resolve(files);
                    })
                } catch (err) {
                    return reject(err);
                }
            });
        });
};

/**
 *
 * @param options
 * @param options.path
 * @param options.uid
 * @param options.gid
 * @returns {Promise.<undefined>}
 */
Sftp.prototype.chown = function (options) {
    const instance = this;
    const ssh2Client = instance._ssh2Client;

    if (_.isString(options)) {
        options = {path: options};
    }

    var path = _.get(options, 'path');
    path = _path.resolve(ssh2Client._remoteDirectory, path);

    var uid = _.get(options, 'uid');
    var gid = _.get(options, 'gid');

    return instance._connect()
        .then(function (sftp) {
            return new Promise(function (resolve, reject) {
                try {
                    sftp.chown(path, uid, gid, function (err) {
                        if (err) {
                            return reject(err);
                        }

                        return resolve();
                    })
                } catch (err) {
                    return reject(err);
                }
            });
        });
};

/**
 *
 * @param options
 * @param options.path
 * @param options.mode
 * @returns {Promise.<undefined>}
 */
Sftp.prototype.chmod = function (options) {
    const instance = this;
    const ssh2Client = instance._ssh2Client;

    if (_.isString(options)) {
        options = {path: options};
    }

    var path = _.get(options, 'path');
    path = _path.resolve(ssh2Client._remoteDirectory, path);

    var mode = _.get(options, 'mode');

    return instance._connect()
        .then(function (sftp) {
            return new Promise(function (resolve, reject) {
                try {
                    sftp.chmod(path, mode, function (err) {
                        if (err) {
                            return reject(err);
                        }

                        return resolve();
                    })
                } catch (err) {
                    return reject(err);
                }
            });
        });
};


/**
 *
 * @param options
 * @param options.path
 * @returns {Promise.<undefined>}
 */
Sftp.prototype.unlink = function (options) {
    const instance = this;
    const ssh2Client = instance._ssh2Client;

    if (_.isString(options)) {
        options = {path: options};
    }

    var path = _.get(options, 'path');
    path = _path.resolve(ssh2Client._remoteDirectory, path);

    return instance._connect()
        .then(function (sftp) {
            return new Promise(function (resolve, reject) {
                try {
                    sftp.unlink(path, function (err) {
                        if (err) {
                            return reject(err);
                        }

                        return resolve();
                    })
                } catch (err) {
                    return reject(err);
                }
            });
        });
};


/**
 *
 * @param options
 * @param options.srcPath
 * @param options.destPath
 * @returns {Function}
 */
Sftp.prototype.rename = function (options) {
    const instance = this;
    const ssh2Client = instance._ssh2Client;

    var srcPath = _.get(options, 'srcPath');
    srcPath = _path.resolve(ssh2Client._remoteDirectory, srcPath);

    var destPath = _.get(options, 'destPath');
    destPath = _path.resolve(ssh2Client._remoteDirectory, destPath);

    return instance._connect()
        .then(function (sftp) {
            return new Promise(function (resolve, reject) {
                try {
                    sftp.rename(srcPath, destPath, function (err) {
                        if (err) {
                            return reject(err);
                        }

                        return resolve();
                    })
                } catch (err) {
                    return reject(err);
                }
            });
        });
};


/**
 *
 * @param options
 * @param options.path
 * @returns {Promise.<undefined>}
 */
Sftp.prototype.mkdir = function (options) {
    const instance = this;
    const ssh2Client = instance._ssh2Client;

    if (_.isString(options)) {
        options = {path: options};
    }

    var path = _.get(options, 'path');
    path = _path.resolve(ssh2Client._remoteDirectory, path);

    return instance._connect()
        .then(function (sftp) {
            return new Promise(function (resolve, reject) {
                try {
                    sftp.mkdir(path, function (err) {
                        if (err) {
                            return reject(err);
                        }

                        return resolve();
                    })
                } catch (err) {
                    return reject(err);
                }
            });
        });
};


/**
 *
 * @param options
 * @param options.path
 * @returns {Promise.<undefined>}
 */
Sftp.prototype.rmdir = function (options) {
    const instance = this;
    const ssh2Client = instance._ssh2Client;

    if (_.isString(options)) {
        options = {path: options};
    }

    var path = _.get(options, 'path');
    path = _path.resolve(ssh2Client._remoteDirectory, path);

    return instance._connect()
        .then(function (sftp) {
            return new Promise(function (resolve, reject) {
                try {
                    sftp.rmdir(path, function (err) {
                        if (err) {
                            return reject(err);
                        }

                        return resolve();
                    })
                } catch (err) {
                    return reject(err);
                }
            });
        });
};


/**
 *
 * @param options
 * @param options.path
 * @returns {Promise.<{}>}
 */
Sftp.prototype.stat = function (options) {
    const instance = this;
    const ssh2Client = instance._ssh2Client;

    if (_.isString(options)) {
        options = {path: options};
    }

    var path = _.get(options, 'path');
    path = _path.resolve(ssh2Client._remoteDirectory, path);

    return instance._connect()
        .then(function (sftp) {
            return new Promise(function (resolve, reject) {
                try {
                    sftp.stat(path, function (err) {
                        if (err) {
                            return reject(err);
                        }

                        return resolve();
                    })
                } catch (err) {
                    return reject(err);
                }
            });
        });
};


/**
 *
 * @param options
 * @param options.path
 * @returns {Promise.<string>}
 */
Sftp.prototype.realpath = function (options) {
    const instance = this;
    const ssh2Client = instance._ssh2Client;

    if (_.isString(options)) {
        options = {path: options};
    }

    var path = _.get(options, 'path');
    path = _path.resolve(ssh2Client._remoteDirectory, path);

    return instance._connect()
        .then(function (sftp) {
            return new Promise(function (resolve, reject) {
                try {
                    sftp.realpath(path, function (err) {
                        if (err) {
                            return reject(err);
                        }

                        return resolve();
                    })
                } catch (err) {
                    return reject(err);
                }
            });
        });
};


/**
 *
 * @param obj
 * @returns {boolean}
 */
Sftp.isReadStream = Sftp.prototype.isReadStream = function (obj) {
    return obj instanceof stream.Stream && (typeof obj._read) === 'function' && (typeof obj._readableState) === 'object';
};

/**
 *
 * @param obj
 * @returns {boolean}
 */
Sftp.isWriteStream = Sftp.prototype.isWriteStream = function (obj) {
    return obj instanceof stream.Stream && (typeof obj._write) === 'function' && (typeof obj._writeableState) === 'object';
};


/**
 *
 * @param options
 * @param options.path
 * @returns {Promise.<boolean>}
 */
Sftp.prototype.exists = function (options) {
    const instance = this;
    const ssh2Client = instance._ssh2Client;

    if (_.isString(options)) {
        options = {path: options};
    }

    var path = _.get(options, 'path');
    path = _path.resolve(ssh2Client._remoteDirectory, path);

    return instance.stat(options)
        .then(function () {
            return true;
        })
        .catch(function (err) {
            return err.code !== 'ENOENT';
        })
};


/**
 *
 * @param options
 * @param options.path
 * @param options.callback
 * @param options.recursive
 * @returns {Promise.<undefined>}
 */
Sftp.prototype.walk = function (options) {
    const instance = this;
    const ssh2Client = instance._ssh2Client;

    if (_.isString(options)) {
        options = {path: options};
    }

    var path = _.get(options, 'path', '');
    var callback = _.get(options, 'callback');
    var recursive = _.get(options, 'recursive', true);

    path = _path.resolve(ssh2Client._remoteDirectory, path);

    return instance.stat({path: path})
        .then(function (pathStats) {
            callback(path, pathStats);
            if (pathStats.isDirectory()) {
                var directoryQueue = [path];

                var whileLoop = Promise.method(function () {
                    if (directoryQueue.length > 0) {
                        var currentDirectory = directoryQueue.shift();
                        return instance.readdir({path: currentDirectory})
                            .then(function (currentDirectoryFiles) {
                                return Promise.each(currentDirectoryFiles, function (file) {
                                    var currentPath = _path.resolve(currentDirectory, file);
                                    return instance.stat({path: currentPath})
                                        .then(function (currentPathStats) {
                                            if (recursive && currentPathStats.isDirectory()) {
                                                directoryQueue.push(currentPath);
                                            }

                                            callback(currentPath, currentPathStats);
                                        });
                                });
                            })
                            .then(function () {
                                return whileLoop();
                            });
                    }
                });

                return whileLoop();
            }
        });
};


/**
 *
 * @param options
 * @param options.path
 * @param options.recursive
 * @returns {Promise.<undefined>}
 */
Sftp.prototype.rm = function (options) {
    const instance = this;
    const ssh2Client = instance._ssh2Client;

    if (_.isString(options)) {
        options = {path: options};
    }

    var path = _.get(options, 'path', '');
    path = _path.resolve(ssh2Client._remoteDirectory, path);

    return instance.ls({path: path, recursive: recursive, details: true})
        .then(function (fileList) {
            fileList.reverse();

            return Promise.each(fileList, function (file) {
                if (file.isDirectory) {
                    return instance.rmdir({path: file.path});
                }
                else {
                    return instance.unlink({path: file.path});
                }
            })
        });
};


/**
 *
 * @param options
 * @param options.path
 * @param options.details
 * @param options.recursive
 * @returns {Promise.<[{}]>}
 */
Sftp.prototype.ls = function (options) {
    const instance = this;
    const ssh2Client = instance._ssh2Client;

    if (_.isString(options)) {
        options = {path: options};
    }

    var path = _.get(options, 'path');
    var details = _.get(options, 'details', true);
    path = _path.resolve(ssh2Client._remoteDirectory, path);
    var recursive = _.get(options, 'recursive', true);

    var fileList = [];
    var callback = function (file, fileStats) {
        if (path === file && fileStats.isDirectory()) {
            return;
        }

        if (details) {
            fileList.push({
                path: file,
                isFile: fileStats.isFile(),
                isDirectory: fileStats.isDirectory(),
                mode: fileStats.mode,
                uid: fileStats.uid,
                gid: fileStats.gid,
                size: fileStats.size,
                atime: fileStats.atime,
                mtime: fileStats.mtime,
                ctime: fileStats.ctime,
                birthtime: fileStats.birthtime
            });
        } else {
            fileList.push(file);
        }
    };

    return instance.walk({path: path, callback: callback, recursive: recursive})
        .then(function () {
            return fileList;
        });
};

/**
 *
 * @param options
 * @param options.path
 * @param options.mode
 * @returns {Promise.<undefined>}
 */
Sftp.prototype.mkdirp = function (options) {
    const instance = this;
    const ssh2Client = instance._ssh2Client;

    if (_.isString(options)) {
        options = {path: options};
    }

    var path = _.get(options, 'path');
    path = _path.resolve(ssh2Client._remoteDirectory, path);

    var mode = _.get(options, 'mode');

    var root = _path.parse(path).root;
    var currentPath = path;
    var directories = [];
    while (currentPath !== root) {
        directories.unshift(currentPath);
        currentPath = _path.dirname(currentPath);
    }

    return Promise.each(directories, function (directory) {
        return instance.stat({path: directory})
            .catch(function () {
                return null;
            })
            .then(function (stats) {
                if (_.isNil(stats)) {
                    return instance.mkdir({path: directory, mode: mode});
                } else if (stats.isFile()) {
                    throw new Error("Invalid Path: " + directory);
                }
            })
    });

};


/**
 *
 * @param options
 * @param options.sourcePath
 * @param options.destinationPath
 * @returns {Promise.<undefined>}
 */
Sftp.prototype.copy = function (options) {
    const instance = this;
    const ssh2Client = instance._ssh2Client;

    var sourcePath = _.get(options, 'sourcePath');
    sourcePath = _path.resolve(ssh2Client._remoteDirectory, sourcePath);
    var destinationPath = _.get(options, 'destinationPath');
    destinationPath = _path.resolve(ssh2Client._remoteDirectory, destinationPath);

    return Promise.props({
        readStream: instance.createReadStream(sourcePath),
        writeStream: instance.createWriteStream(destinationPath)
    })
        .then(function (props) {
            var readStream = props.readStream;
            var writeStream = props.writeStream;

            return new Promise(function (resolve, reject) {
                readStream.once('open', function () {
                    return resolve(readStream);
                });

                readStream.once('finish', function () {
                    return resolve(readStream);
                });

                readStream.once('error', function (err) {
                    return reject(err);
                });

                readStream.pipe(writeStream);
            });
        });
};


/**
 *
 * @param options
 * @param options.path
 * @param options.encoding
 * @param options.flags
 * @returns {Promise.<Buffer>}
 */
Sftp.prototype.readFile = function (options) {
    const instance = this;
    const ssh2Client = instance._ssh2Client;
    if (_.isString(options)) {
        options = {path: options};
    }

    var path = _.get(options, 'path');
    path = _path.resolve(ssh2Client._remoteDirectory, path);

    var encoding = _.get(options, 'encoding');
    var flags = _.get(options, 'flags');

    return instance.createReadStream({path: path})
        .then(function (stream) {
            return new Promise(function (resolve, reject) {
                var chunks = [];

                stream.on('data', function (chunk) {
                    chunks.push(chunk);
                });
                stream.on('end', function () {
                    resolve(Buffer.concat(chunks));
                });
                stream.on('close', function () {
                    resolve(Buffer.concat(chunks));
                });
                stream.on('error', function (err) {
                    reject(err);
                });
                stream.resume();
            })
        });
};


/**
 *
 * @param options
 * @param options.path
 * @param options.data
 * @param options.encoding
 * @param options.mode
 * @param options.flags
 * @param options.chunkSize
 * @returns {Promise.<undefined>}
 */
Sftp.prototype.writeFile = function (options) {
    const instance = this;
    const ssh2Client = instance._ssh2Client;
    if (_.isString(options)) {
        options = {path: options};
    }

    var path = _.get(options, 'path');
    path = _path.resolve(ssh2Client._remoteDirectory, path);

    var encoding = _.get(options, 'encoding');

    var data = _.get(options, 'data');
    if (_.isString(data)) {
        data = new Buffer(data, encoding);
    }

    var mode = _.get(options, 'mode');
    var flags = _.get(options, 'flags');
    var chunkSize = _.get(options, 'chunkSize', 32768);

    return instance.createWriteStream({path: path})
        .then(function (stream) {
            return new Promise(function (resolve, reject) {
                try {
                    stream.on('finish', function () {
                        return resolve();
                    });
                    stream.on('close', function () {
                        return resolve();
                    });
                    stream.on('error', function (err) {
                        return reject(err);
                    });

                    var i = 0, j, chunk;

                    while (i < data.length) {
                        j = i + chunkSize;
                        chunk = data.slice(i, j);
                        if (j < data.length) {
                            stream.write(chunk);
                        } else {
                            stream.end(chunk);
                        }
                    }
                } catch (err) {
                    reject(err);
                }
            })
        });

};


module.exports = Sftp;