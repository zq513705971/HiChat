var express = require('express');
var path = require('path');
var app = express();
var http = require('http').Server(app);

var io = require('socket.io')(http);
var ChatService = require('./server/ChatService');

app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");//项目上线后改成页面的地址
    res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    next();
});

app.use(express.static(path.join(__dirname, 'public/dist')));
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/dist/index.html');
});

let service = new ChatService(io);
service.start();

http.listen(3000, function () {
    console.log('listening on *:3000');
});