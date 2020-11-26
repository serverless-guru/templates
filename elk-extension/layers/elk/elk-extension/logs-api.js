const fetch = require('node-fetch');
const { PORT } = require('./http-server');

const baseUrl = `http://${process.env.AWS_LAMBDA_RUNTIME_API}/2020-08-15/logs`;

const MAX_ITEMS = 10000;
const MAX_BYTES = 262144;
const TIMEOUT_MS = 1000;

const subscribeToLogsAPI = async ({ extensionId, subscribeTo, maxItems = MAX_ITEMS, maxBytes = MAX_BYTES, timeoutMs = TIMEOUT_MS }) => {
    const res = await fetch(`${baseUrl}`, {
        method: 'put',
        body: JSON.stringify({
            'types': subscribeTo,
            buffering: { maxItems, maxBytes, timeoutMs },
            'destination': {
                'protocol': 'HTTP',
                'URI': `http://sandbox:${PORT}`
            }
        }),
        headers: {
            'Lambda-Extension-Identifier': extensionId,
        }
    });

    if (!res.ok) {
        console.error('Logs API call failed', await res.text());
        return null;
    }

    return res;
}

module.exports = {
    subscribeToLogsAPI,
    MAX_ITEMS,
    MAX_BYTES,
    TIMEOUT_MS
};