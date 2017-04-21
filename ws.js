const WebSocket = require('ws');
var url = require('url');
var websocket = require('./routes/websocket');
var https = require('https');

function initWebsocket() {
    // Broadcast to all.
    wss.broadcast = function broadcast(data) {
        wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(data);
            }
        });
    };

    wss.on('connection', function connection(ws) {
        const location = url.parse(ws.upgradeReq.url, true);
        console.log('connection id: %s', location.query.id);
        console.log('connection appId: %s', location.query.appId);
        // You might use location.query.access_token to authenticate or share sessions
        // or ws.upgradeReq.headers.cookie (see http://stackoverflow.com/a/16395220/151312)
        if (location.query.appId && websocket.rs[location.query.appId]) {
            var service = websocket.rs[location.query.appId];
            var clients = websocket.rc[location.query.appId];
            ws.id = location.query.id;
            ws.appId = location.query.appId;
            service.clients[ws.id] = ws.id;
            clients[ws.id] = ws;

            var options = {
                hostname: service.callbackUrl.hostname,
                path: service.callbackUrl.path + "?clientId=" + ws.id,
                headers: {
                    "Authorization": "testusertoken",
                    'Content-Type': 'Application/json',
                    "Content-Length": 0
                },
                method: "GET"
            };
            var req = https.request(options, function(res) {
                console.log('STATUS: ' + res.statusCode);
                console.log('HEADERS: ' + JSON.stringify(res.headers));
                res.setEncoding('utf8');
                res.on('data', function(chunk) {
                    console.log('BODY: ' + chunk);
                });
            });
            req.on('error', function(e) {
                console.log('problem with request: ' + e.message);
            });
            req.end();
        }

        ws.on('message', function incoming(message) {
            console.log('received: %s', message);
            try {
                wss.broadcast(message);
            } catch (e) {
                console.log(e);
            }
        });

        ws.on('close', function close(code, reason) {
            var service = websocket.rs[ws.appId];
            var clients = websocket.rc[ws.appId];
            delete service.clients[ws.id];
            delete clients[ws.id];
            console.log("delete " + ws.id + " in appId " + ws.appId);
        });

        ws.send("init");
    });
}

module.exports = initWebsocket;
