const { gqlHandler, gqlSchema } = require('../../graphql/server');
const { getMocksByHeaders } = require('../utils/mocks');

const schema = gqlSchema(__dirname + '/schema.graphql');
const defaultMocks = require('./mocks/default');

const MOCKS_PATH = __dirname + '/mocks';

module.exports.graphql = async (event) => {
  const mocks = getMocksByHeaders({ headers: event.headers, mocksPath: MOCKS_PATH }) || defaultMocks;

  const params = {
    event,
    schema,
    mocks,
    introspection: true,
    playground: true
  }

  return gqlHandler(params);
}