const _ = require('lodash');

var random = {};

random.getInteger = function (min, max) {
    if (arguments.length === 1) {
        min = 0;
        max = arguments[0];
    }

    if (_.isNil(min)) {
        min = 0;
    }
    if (_.isNil(max)) {
        max = Number.MAX_SAFE_INTEGER;
    }

    return min + Math.round(Math.random() * (max - min));
};

var CharacterClasses = {
    alnum: ['a-z', 'A-Z', '0-9'],
    alpha: ['a-z', 'A-Z'],
    ascii: '\x00-\x7F',
    blank: ' \t',
    cntrl: ['\x00-\x1F', '\x7F'],
    digit: '0-9',
    graph: '\x21-\x7E',
    lower: 'a-z',
    print: '\x20-\x7E',
    punct: '!"#$%&\'()*+,-./:;<=>?@[]^_`{|}~',
    space: ' \t\r\n\v\f',
    upper: 'A-Z',
    word: ['A-Z', 'a-z', '0-9', '_'],
    xdigit: ['A-F', 'a-f', '0-9']
};

random.getCharacter = function (characterClasses) {
    if (_.isNil(characterClasses)) {
        characterClasses = ['alnum'];
    }

    if (!_.isArray(characterClasses)) {
        characterClasses = [characterClasses];
    }

    var range = _.map(characterClasses, function (characterClass) {
        if (_.isString(characterClass) && _.has(CharacterClasses, characterClass)) {
            return _.get(CharacterClasses, characterClass);
        }
        return characterClass;
    });

    function pickCharacter(range) {
        if (_.isArray(range)) {
            return pickCharacter(random.getArrayValue(range));
        } else {
            if (range.length === 3 && range[1] === '-') {
                return String.fromCharCode(random.getInteger(range.charCodeAt(0), range.charCodeAt(2)));
            } else {
                return random.getArrayValue(range);
            }
        }
    }

    return pickCharacter(range);
};

random.getCharacter.CharacterClasses = CharacterClasses;
random.getArrayValue = function (array) {
    var index = Math.floor(Math.random() * array.length);
    return array[index];
};

random.getString = function (length, characterClasses) {
    if (_.isNil(length)) {
        length = 10;
    }

    var string = [];
    for (var i = 0; i < length; i++) {
        string.push(random.getCharacter(characterClasses));
    }

    return string.join('');
};

module.exports = random;