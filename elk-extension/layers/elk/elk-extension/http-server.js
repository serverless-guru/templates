const http = require('http');

const HOST = '0.0.0.0';
const PORT = 4243;

const createHTTPServer = (logs) => {
    const server = http.createServer((req, res) => {
        let data = '';
        
        req.on('data', chunk => {
            data += chunk;
        })
        req.on('end', async () => {
            logs.push(data);
        })

        res.writeHead(200);
        res.end(`{"message": "success"}`);
    });

    server.listen(PORT, HOST, () => {
        console.log(`Server is running on http://${HOST}:${PORT}`);
    });
}


module.exports = {
    createHTTPServer,
    HOST,
    PORT
};