const uuidv4 = require('uuid/v4');

let helper = {};

helper.print = name => {
    return `hello ${name} and ${uuidv4()}`;
};

module.exports = helper;