const MOCK_HEADER_NAME = 'x-mock-name';

const getMocksByHeaders = ({ headers, mocksPath }) => {
  const mockName = headers[MOCK_HEADER_NAME];

  try {
    return require(`${mocksPath}/${mockName}.js`);
  } catch {
    return null;
  }
}

module.exports = {
  getMocksByHeaders
}