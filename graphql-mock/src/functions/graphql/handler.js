const { gqlHandler } = require('../../graphql/server');

module.exports.graphql = (event) => {
  return gqlHandler({ event, introspection: true, playground: true });
}