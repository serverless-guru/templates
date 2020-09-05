const { ApolloServer, gql } = require('apollo-server-lambda');
const fs = require('fs');

const defaultMocks = require('./mocks');

const gqlSchema = (path) => {
  return fs.readFileSync(path, 'utf8');
}

const gqlHandler = ({ event, context = {}, schema = null, mocks = defaultMocks, introspection = false, playground = false } = {}) => {

  const typeDefs = gql(schema || gqlSchema(__dirname + '/schema.graphql'));

  const server = new ApolloServer({
    typeDefs,
    mocks,
    introspection,
    playground
  });

  const handler = server.createHandler()

  return new Promise((resolve, reject) => {
    const callback = (error, body) => (error ? reject(error) : resolve(body));
    handler(event, context, callback);
  });
}

module.exports = {
  gqlHandler,
  gqlSchema
}