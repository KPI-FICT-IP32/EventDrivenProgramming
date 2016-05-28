"use strict";

global.api = {};
api.fs = require('fs');
api.http = require('http');
api.websocket = require('websocket');


const FILES = {
  '/'              : './index.html',
  '/reactivity.js' : './reactivity.js',
  '/formula.js'    : './formula.js',
}


const server = api.http.createServer((req, res) => {
  // Reading file here to prevent restarting app on files changes.
  // TODO: rewrite when development is done
  const filename = FILES[req.url];
  if (filename) {
    const file = api.fs.readFileSync(filename);
    res.writeHead(200);
    res.end(file);
  } else {
    res.writeHead(404);
    res.end(`
      <html>
      <head><title>404 Not found</title></head>
      <body>
        <img src="http://http.cat/404">
      </body>
      </html>
    `);
  }
});

server.listen(8042, () => {
  console.log('Listen port 8042');
});

const ws = new api.websocket.server({
  httpServer: server,
  autoAcceptConnections: false
});

const clients = [];

ws.on('request', (req) => {
  const connection = req.accept('', req.origin);
  clients.push(connection);
  console.log(`Connected ${connection.remoteAddress}`);
  connection.on('message', (message) => {
    const dataName = `${message.type}Data`,
        data = message[dataName];
    console.log(`Received: ${data}`);
    clients.forEach((client) => {
      debugger;
      if (connection !== client) {
        client.send(data);
      }
    });
  });
  connection.on('close', (reasonCode, description) => {
    console.log(`Disconnected ${connection.remoteAddress}`);
  });
});
