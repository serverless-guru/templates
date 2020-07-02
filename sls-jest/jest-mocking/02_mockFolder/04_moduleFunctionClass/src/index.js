const toMock = require('./codeToMock')

module.exports = () => {
    const cls = new toMock.method()
    const result = cls.action()
    return result
}

