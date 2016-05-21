"use strict";

global.api = {};
api.fs = require('fs');
api.http = require('http');
api.websocket = require('websocket');


// const index = api.fs.readFileSync('./index.html');
// const reactivity_js = api.fs.readFileSync('./reactivity.js');

const server = api.http.createServer((req, res) => {
  if (req.url === '/') {
    // Readin file here to prevent restarting app on files changes.
    // TODO: remove when development is done
    const index = api.fs.readFileSync('./index.html');
    res.writeHead(200);
    res.end(index);
  } else if (req.url === '/reactivity.js') {
    const reactivity_js = api.fs.readFileSync('./reactivity.js');
    res.writeHead(200);
    res.end(reactivity_js);
  } else {
    res.writeHead(404);
    res.end();
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
      if (connection !== client) {
        client.send(data);
      }
    });
  });
  connection.on('close', (reasonCode, description) => {
    console.log(`Disconnected ${connection.remoteAddress}`);
  });
});
