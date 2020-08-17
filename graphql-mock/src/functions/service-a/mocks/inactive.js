const { MockList } = require('apollo-server-lambda');
const casual = require('casual');

module.exports = {
  Query: () =>({
    teamMembers: () => new MockList([4,7]),
  }),
  

  TeamMember: () => ({
    age: casual.integer(from = 25, to = 55),
    name: casual.first_name,
    surname: casual.last_name,
    active: false
  })
}