let Utils = require('./Utils');
let ChatServer = require('./ChatServer');
let ChatData = require('./ChatData');

function ChatService(io) {
    this.io = io;
    var keys = ChatData.getAppkeys();
    this.apps = new Map();
    this.io && keys.forEach(key => {
        var initData = {
            users: ChatData.getUsers(key),
            groups: ChatData.getGroups(key)
        };
        this.apps.set(key, new ChatServer(this.io, key, initData));
    })
}

ChatService.prototype.start = function () {
    this.io && this.apps && this.apps.forEach((server, appKey) => {
        server.init();
    });
}

module.exports = ChatService;