var express = require('express');
var router = express.Router();

var registryServices = {
    "test": {
        appId: "test", // 标志唯一的一个服务，不可重复
        appName: "测试服务",
        appKey: "", // 用来做权限验证
        callbackUrl: {
            hostname: "api.leiketang.cn",
            path: "/courses/532"
        }, // 当有客户端连接时，将客户端id发送给此url 方式 get "callbackUrl?clientId=id"
        clients: {} // 记录连接到此app的客户端id
    }
}
var registryClients = {
    "test": {}
};
router.rs = registryServices;
router.rc = registryClients;
/* GET home page. */
router.get('/', function(req, res, next) {
    res.send("Websocket Service");
});

// 获取全部注册服务的信息
router.get('/service', function(req, res, next) {
    res.json(registryServices);
});
// 注册服务
router.post('/service', function(req, res, next) {
    // var service = {
    //     appId: 1234,
    //     appName: "服务名",
    //     appKey: "",
    //     clients: {}
    // };
    var service = req.body;
    service.clients = {};
    if (service.appId && service.appName) {
        // 最多为10个项目提供服务
        if (countProperty(registryServices) >= 10) {
            var err = new Error('too many service');
            err.status = 500;
            next(err);
        } else {
            if (!registryServices[service.appId]) {
                registryServices[service.appId] = service;
                registryClients[service.appId] = {};
            }
            res.send("regist success");
        }
    } else {
        var err = new Error('lack of parameters');
        err.status = 400;
        next(err);
    }
});
// 获取单个注册服务信息
router.get('/service/:appId', function(req, res, next) {
    var appId = req.params.appId;
    if (appId) {
        res.json(registryServices[appId]);
    } else {
        var err = new Error(appId + ' does not exist.');
        err.status = 400;
        next(err);
    }

});
// 删除一个服务
router.delete('/service/:appId', function(req, res, next) {
    var appId = req.params.appId;
    if (appId) {
        delete registryServices[appId];
        delete registryClients[appId];
        res.send("success");
    } else {
        var err = new Error(appId + ' does not exist.');
        err.status = 400;
        next(err);
    }
});
// 获取连接到一个服务上的客户端id列表
router.get('/service/:appId/client', function(req, res, next) {
    var appId = req.params.appId;
    if (appId) {
        res.send(registryServices[appId].clients);
    } else {
        var err = new Error(appId + ' does not exist.');
        err.status = 400;
        next(err);
    }
});

function countProperty(obj) {
    var count = 0;
    for (var i in obj)
        if (obj.hasOwnProperty(i)) {
            count++;
        }
    return count;
}

module.exports = router;
