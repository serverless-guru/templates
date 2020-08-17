const gqlHandler = require('../../graphql/server');

module.exports.graphql = async (event, context) => {
  const handler = gqlHandler({ introspection: true, playground: true });

  return new Promise((resolve, reject) => {
    const callback = (error, body) => (error ? reject(error) : resolve(body));
    handler(event, context, callback);
  });
}