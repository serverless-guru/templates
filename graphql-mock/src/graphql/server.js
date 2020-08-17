const { ApolloServer, gql } = require('apollo-server-lambda');

const defaulSchema = require('./schema');
const defaultMocks = require('./mocks');

module.exports = ({ schema = defaulSchema, mocks = defaultMocks, introspection = false, playground = false } = {}) => {
  const typeDefs = gql(schema);

  const server = new ApolloServer({
    typeDefs,
    mocks,
    introspection,
    playground
  });

  return server.createHandler()
}