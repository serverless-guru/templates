casual = require('casual');

module.exports = {
  String: () => casual.title,

  User: () => ({
    id: casual.integer(from = 0, to = 1000),
    name: casual.full_name,
  }),

  // Custom scalars
  DateTime: () => casual.date(format = 'YYYY-MM-DDTHH:mm:ss.SSSZZ')
}