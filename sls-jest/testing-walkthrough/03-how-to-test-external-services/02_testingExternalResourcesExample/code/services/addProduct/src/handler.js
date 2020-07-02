const io = require('./io')
const domain = require('./domain')

exports.create = domain(io()).create
