const toMock = require('./codeToMock')

module.exports = () => {
    const cls = new toMock()
    const result = cls.action()
    return result
}

