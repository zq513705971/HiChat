let Utils = require('./Utils');
let ChatServer = require('./ChatServer');

function ChatService(io) {
    this.io = io;
    var keys = ["XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"];
    this.apps = new Map();
    this.io && keys.forEach(key => {
        this.apps.set(key, new ChatServer(this.io, key, this._getAppInitData(key)));
    })
}

ChatService.prototype._getAppInitData = (appKey) => {
    var self = this;
    return {
        users: [
            {
                userId: "zhanqun",
                name: "詹群",
                password: "zhanqun",
                friends: ["smallbyte", "admin"]
            },
            {
                userId: "smallbyte",
                name: "小字节",
                password: "smallbyte",
                friends: ["zhanqun", "admin"]
            },
            {
                userId: "admin",
                name: "管理员",
                password: "admin",
                friends: ["smallbyte", "zhanqun"]
            }
        ],
        groups: [
            {
                groupId: "01",
                name: "测试群组",
                members: ["zhanqun", "smallbyte", "admin"]
            }
        ]
    };
}

ChatService.prototype.start = function () {
    this.io && this.apps && this.apps.forEach((server, appKey) => {
        server.init();
    });
}

module.exports = ChatService;