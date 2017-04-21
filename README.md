#WebsocketService
这是一个用来提供websocket长连接服务的平台，其他后台服务器可以调用接口来注册自己的服务，从而使用此平台提供的长连接服务，浏览器端直接和此平台连接，所以自己的后台只需要提供一个callback接口，并在需要向客户端推送数据时调用此平台的发送消息接口即可。

## 基于
* [expressjs / express](https://github.com/expressjs/express)
* [websockets / ws](https://github.com/websockets/ws)

## 使用方式
在项目根目录下运行
`npm install`
`npm install --save ws`
来安装依赖，运行
`npm start`
来启动服务器端，默认会运行在`localhost:3000`端口，可根据需要修改。默认的`index.html`中，使用的是客户端向服务器端发送消息时广播到所有其他连接到平台的客户端的功能。
## 接入服务方式
对于需要使用此平台提供的websocket服务的其他后台服务器，首先需要调用
```js
post /service
{
    appId: "test", // 标志唯一的一个服务，不可重复
    appName: "测试服务",
    appKey: "", // 用来做权限验证
    callbackUrl: {
        hostname: "api.leiketang.cn",
        path: "/courses/532"
    }, // 当有客户端连接时，将客户端id发送给此url 方式 get "callbackUrl?clientId=id"
    clients: {} // 记录连接到此app的客户端id
}
```

接口来注册自己的服务，注册成功之后，在需要使用长连接服务的客户端建立长连接时需要在查询参数中传递自己对应后台服务器的appId，和一个可以唯一标志自己客户端的id（例如时间戳）方式为

```js
var host = window.document.location.host.replace(/:.*/, '');
var timestamp = new Date().getTime();
var ws = new WebSocket('ws://' + host + ':3000?id=' + timestamp + '&appId=test');
```

此时平台成功于客户端建立长连接后，会调用服务器注册时提供的callbackUrl，并以查询参数的方式传递此客户端的clientId，服务器需要自己记录此clientId以用于对单独的客户端推送消息。
当服务器需要向客户端推送消息时，只需调用平台的对应接口

```
post /send?id=111&appId=222
post /sendToAll?appId=222
```

send接口用于向对应id的单独客户端发送消息，sendToAll用于向此连接于此服务appId的所有客户端推送消息。
