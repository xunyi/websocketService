const WebSocket = require('ws');
var express = require('express');
var router = express.Router();
var websocket = require('./websocket');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'Express'
    });
});

router.post('/send', function(req, res, next) {
    var id = req.query.id;
    var appId = req.query.appId;
    var data = req.body;
    console.log(data);
    if (appId && websocket.rs[appId] && id && websocket.rs[appId].clients[id]) {
        var client = websocket.rc[appId][id];
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    }
    res.send("success");
});

router.post('/sendToAll', function(req, res, next) {
    var appId = req.query.appId;
    var data = req.body;
    console.log(data);
    if (appId && websocket.rs[appId]) {
        for (var i in websocket.rc[appId]) {
            var client = websocket.rc[appId][i];
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(data));
            }
        }
    }
    res.send("success");
});

module.exports = router;
