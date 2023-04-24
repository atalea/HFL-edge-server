require('dotenv').config();

const port = process.env.PORT || 3001;
const host = process.env.HOST || "127.0.0.1";
const central_server = `http://${process.env.CENTRAL_SERVER}:3000` || "http://127.0.0.1:3000";
const config = {
    port: port,
    host: host,
    central_server: central_server,
    server: {url: central_server, callback: `http://${host}:${port}`},
    client: {model: `http://${host}:${port}/model/model.json`, callback: `http://${host}:${port}/upload`}
}

module.exports = config;