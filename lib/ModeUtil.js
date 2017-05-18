const _ = require('lodash');

var ModeUtil = {};

ModeUtil.S_ISUID = parseInt(4000, 8);
ModeUtil.S_ISGID = parseInt(2000, 8);
ModeUtil.S_ISVTX = parseInt(1000, 8);
ModeUtil.S_IRWXU = parseInt(700, 8);
ModeUtil.S_IRUSR = parseInt(400, 8);
ModeUtil.S_IWUSR = parseInt(200, 8);
ModeUtil.S_IXUSR = parseInt(100, 8);
ModeUtil.S_IRWXG = parseInt(70, 8);
ModeUtil.S_IRGRP = parseInt(40, 8);
ModeUtil.S_IWGRP = parseInt(20, 8);
ModeUtil.S_IXGRP = parseInt(10, 8);
ModeUtil.S_IRWXO = parseInt(7, 8);
ModeUtil.S_IROTH = parseInt(4, 8);
ModeUtil.S_IWOTH = parseInt(2, 8);
ModeUtil.S_IXOTH = parseInt(1, 8);
ModeUtil.S_IRUGO = parseInt(444, 8);
ModeUtil.S_IWUGO = parseInt(222, 8);
ModeUtil.S_IXUGO = parseInt(111, 8);

/**
 *
 * @param mode
 * @returns {{numericMode: number, operation: string, conditionalExecute: boolean}}
 * @see {@link https://www.gnu.org/software/coreutils/manual/html_node/Symbolic-Modes.html#Symbolic-Modes}
 */
ModeUtil.parseSymbolicMode = function (mode) {

    if (!_.isString(mode)) {
        throw new Error('Invalid parameter: mode');
    }

    var users = [];
    var operation = null;
    var conditionalExecute = false;

    var numericMode = 0;
    _.each(mode, function (modeChar) {
        switch (modeChar) {
            case 'u':
            case 'g':
            case 'o':
            case 'a':
                if (operation !== null) {
                    throw new Error("Invalid format in parameter: mode")
                }
                users.push(modeChar);
                break;
            case '+':
            case '-':
            case '=':
                if (operation !== null) {
                    throw new Error("Invalid format in parameter: mode")
                }
                operation = modeChar;
                break;
            case 'r':
                if (operation === null) {
                    throw new Error("Invalid format in parameter: mode")
                }
                _.each(users, function (usersChar) {
                    switch (usersChar) {
                        case 'u':
                            numericMode |= ModeUtil.S_IRUSR;
                            break;
                        case 'g':
                            numericMode |= ModeUtil.S_IRGRP;
                            break;
                        case 'o':
                            numericMode |= ModeUtil.S_IROTH;
                            break;
                        case 'a':
                            numericMode |= ModeUtil.S_IRUGO;
                            break;
                    }
                });
                break;
            case 'w':
                if (operation === null) {
                    throw new Error("Invalid format in parameter: mode")
                }
                _.each(users, function (usersChar) {
                    switch (usersChar) {
                        case 'u':
                            numericMode |= ModeUtil.S_IWUSR;
                            break;
                        case 'g':
                            numericMode |= ModeUtil.S_IWGRP;
                            break;
                        case 'o':
                            numericMode |= ModeUtil.S_IWOTH;
                            break;
                        case 'a':
                            numericMode |= ModeUtil.S_IWUGO;
                            break;
                    }
                });
                break;
            case 'x':
                if (operation === null) {
                    throw new Error("Invalid format in parameter: mode")
                }
                _.each(users, function (usersChar) {
                    switch (usersChar) {
                        case 'u':
                            numericMode |= ModeUtil.S_IXUSR;
                            break;
                        case 'g':
                            numericMode |= ModeUtil.S_IXGRP;
                            break;
                        case 'o':
                            numericMode |= ModeUtil.S_IXOTH;
                            break;
                        case 'a':
                            numericMode |= ModeUtil.S_IXUGO;
                            break;
                    }
                });
                break;
            case 'X':
                if (operation === null) {
                    throw new Error("Invalid format in parameter: mode")
                }
                conditionalExecute = true;
                _.each(users, function (usersChar) {
                    switch (usersChar) {
                        case 'u':
                            numericMode |= ModeUtil.S_IXUSR;
                            break;
                        case 'g':
                            numericMode |= ModeUtil.S_IXGRP;
                            break;
                        case 'o':
                            numericMode |= ModeUtil.S_IXOTH;
                            break;
                        case 'a':
                            numericMode |= ModeUtil.S_IXUGO;
                            break;
                    }
                });
                break;
            case 's':
                if (operation === null) {
                    throw new Error("Invalid format in parameter: mode")
                }
                _.each(users, function (usersChar) {
                    switch (usersChar) {
                        case 'u':
                            numericMode |= ModeUtil.S_ISUID;
                            break;
                        case 'g':
                            numericMode |= ModeUtil.S_ISGID;
                            break;
                        case 'a':
                            numericMode |= ModeUtil.S_ISUID;
                            numericMode |= ModeUtil.S_ISGID;
                            break;
                    }
                });
                break;
            case 't':
                if (operation === null) {
                    throw new Error("Invalid format in parameter: mode")
                }
                _.each(users, function (usersChar) {
                    switch (usersChar) {
                        case 'o':
                        case 'a':
                            numericMode |= ModeUtil.S_ISVTX;
                            break;
                    }
                });
                break;
            default:
                throw new Error('Invalid character in parameter: mode')
        }
    });

    if (operation === null) {
        operation = '=';
    }

    return {numericMode: numericMode, operation: operation, conditionalExecute: conditionalExecute};
};

/**
 *
 * @param mode
 * @returns {{numericMode: number, operation: string, conditionalExecute: boolean}}
 * @see {@link https://www.gnu.org/software/coreutils/manual/html_node/Numeric-Modes.html#Numeric-Modes}
 */
ModeUtil.parseNumericMode = function (mode) {

    var operation = '=';
    var numericMode = 0;
    var conditionalExecute = false;

    if (_.isString(mode)) {
        try {
            switch (mode[0]) {
                case '+':
                case '-':
                case '=':
                    operation = mode[0];
                    mode = mode.slice(1);
                    break;
            }
            numericMode = parseInt(mode, 8);
        } catch (err) {
            var error = new Error('Invalid format in parameter: mode\n' + err.message);
            error.stack = err.stack;
            throw error;
        }
    } else if (_.isNumber(mode)) {
        numericMode = mode;
    } else {
        throw new Error('Invalid parameter: mode');
    }

    return {numericMode: numericMode, operation: operation, conditionalExecute: conditionalExecute};
};

ModeUtil.parseNumericMode = function (mode) {

    var operation = '=';
    var numericMode = 0;
    var conditionalExecute = false;

    if (_.isString(mode)) {
        try {
            switch (mode[0]) {
                case '+':
                case '-':
                case '=':
                    operation = mode[0];
                    mode = mode.slice(1);
                    break;
            }
            numericMode = parseInt(mode, 8);
        } catch (err) {
            var error = new Error('Invalid format in parameter: mode\n' + err.message);
            error.stack = err.stack;
            throw error;
        }
    } else if (_.isNumber(mode)) {
        numericMode = mode;
    } else {
        throw new Error('Invalid parameter: mode');
    }

    if (_.isNaN(numericMode)) {
        throw new Error('Invalid parameter: mode');
    }

    return {numericMode: numericMode, operation: operation, conditionalExecute: conditionalExecute};
};

ModeUtil.parseMode = function (mode) {

    if (_.isString(mode)) {
        mode = mode.split(',');
    }

    if (!_.isArray(mode)) {
        mode = [mode];
    }

    return _.map(mode, function (mode) {
        var error;
        try {
            return ModeUtil.parseNumericMode(mode);
        } catch (err) {
            error = err;
        }
        try {
            return ModeUtil.parseSymbolicMode(mode);
        } catch (err) {
            error = err;
        }

        throw error || new Error("Invalid parameter: mode");
    });
};

ModeUtil.processModeOperations = function (fileStats, modeOperations) {

    var newFileMode = fileStats.mode;

    _.each(modeOperations, function (modeOperation) {

        var newMode = modeOperation.numericMode;
        if (modeOperation.conditionalExecute) {
            var conditionalExecuteMode = newMode & ModeUtil.S_IXUGO;
            newMode &= ~ModeUtil.S_IXUGO;

            switch (modeOperation.operation) {
                case '-':
                    newFileMode &= ~newMode;
                    break;
                case '+':
                    newFileMode |= newMode;
                    break;
                default:
                    newFileMode = newMode;
                    break;
            }

            var isDirectory = _.isFunction(fileStats.isDirectory) && fileStats.isDirectory() || fileStats.isDirectory;
            if (isDirectory || (fileStats & ModeUtil.S_IXUGO) > 0) {
                newFileMode |= conditionalExecuteMode;
            }
        } else {
            switch (modeOperation.operation) {
                case '-':
                    newFileMode &= ~newMode;
                    break;
                case '+':
                    newFileMode |= newMode;
                    break;
                default:
                    newFileMode = newMode;
                    break;
            }
        }
    });

    return newFileMode;
};

module.exports = ModeUtil;