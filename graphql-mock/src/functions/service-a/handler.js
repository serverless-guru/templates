const gqlHandler = require('../../graphql/server');
const schema = require('./schema');
const defaultMocks = require('./mocks/default');

module.exports.graphql = async (event, context) => {
  const headerMockName = event.headers['x-mock-name'];

  const mocks = getMocks(headerMockName);

  const handler = gqlHandler({ schema, mocks, introspection: true, playground: true });

  return new Promise((resolve, reject) => {
    const callback = (error, body) => (error ? reject(error) : resolve(body));
    handler(event, context, callback);
  });
}

const getMocks = (name, path = './mocks') => {
  if (!name) {
    return defaultMocks;
  }

  try {
    return require(`${path}/${name}.js`);
  } catch {
    return defaultMocks;
  }
}