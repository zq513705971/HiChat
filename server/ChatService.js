let Utils = require('./Utils');
function ChatService(io) {
    let appKeys = new Map();
    let userInfos = new Map();
    let sockets = new Map();

    (function () {
        //appKeys.set(Utils.guid(), "Chat");
        appKeys.set("XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX", "Chat");
    })();

    this.appKeys = appKeys;
    this.userInfos = userInfos;
    this.sockets = sockets;
    this.io = io;
}

ChatService.prototype.start = function () {
    this.io && this._init();
}

ChatService.prototype._init = function () {
    var self = this;
    self.appKeys.forEach((appName, appKey) => {
        console.log(appKey, appName);
        self.io.of(appKey).on('connection', function (socket) {
            console.log('a user connected');

            socket.on("user/signIn", (user, callback) => {
                self._signIn(socket, appKey, user, callback);
            });
            socket.on("sendMsg", (data) => {
                self._sendMsg(socket, data);
            });
            socket.on("disconnect", () => self._disconnect(socket));
        });
    });
}

/**
 * 登录
 */
ChatService.prototype._signIn = function (socket, appKey, user, callback) {
    console.log(appKey, user);
    var self = this;
    var userInfo = self.userInfos.get(user.userName);
    if (!userInfo) {
        userInfo = {
            userName: user.userName,
            token: Utils.guid(),
            sockets: []
        };
        self.userInfos.set(user.userName, userInfo);
    }
    this.sockets.set(socket, userInfo.userName);
    userInfo.sockets.push(socket);
    console.log(userInfo.userName, userInfo.token);

    var friends = self._getLoginedUsers(appKey, userInfo.userName);

    callback && callback({ userName: userInfo.userName, token: userInfo.token, friends });

    var loginedUser = { userName: userInfo.userName };
    socket.broadcast.emit("newSignIn", loginedUser);
}

ChatService.prototype._getLoginedUsers = function (appKey, userName) {
    var self = this;

    var users = [];
    var userInfos = self.userInfos;
    userInfos.forEach(user => {
        if (userName !== user.userName) {
            users.push({
                userName: user.userName
            });
        }
    });
    return users;
}

/**
 * 注册
 */
ChatService.prototype._signUp = function (appKey, user, callback) {

}

/**
 * 根据socket获取连接用户信息
 */
ChatService.prototype._getUserInfo = function (socket) {
    var self = this;
    var userInfos = self.userInfos;
    var userName = self.sockets.get(socket);
    var userInfo = userInfos.get(userName);
    return userInfo;
}

/**
 * 断开链接
 */
ChatService.prototype._disconnect = function (socket) {
    var self = this;
    var userInfo = self._getUserInfo(socket);

    if (!userInfo)
        return;

    var sockets = userInfo.sockets;
    var index = sockets.indexOf(socket);
    if (index >= 0)
        sockets.splice(index, 1);

    console.log(userInfo.userName + "-disconnect-" + sockets.length);
}

ChatService.prototype._sendMsg = function (socket, data) {
    //conversationType=PRIVATE->私聊（userId），conversationType=GROUP->群组(groupId)
    var targetId = data.targetId;
    //PRIVATE-私聊，GROUP-群组
    var conversationType = data.conversationType;

    var fromUser = this._getUserInfo(socket);

    var userIds = this._getTargetIds(conversationType, targetId);
    if (userIds.indexOf(fromUser.userName) == -1) {
        //userIds.push(fromUser.userName);
    }
    var sockets = this._getSockets(userIds);

    if (fromUser) {
        data = { ...data, from: { userName: fromUser.userName } };

        this._send(sockets, data);
    }
}

ChatService.prototype._getUserSockets = function (userId) {
    var self = this;
    var userInfo = self.userInfos.get(userId);
    if (userInfo)
        return userInfo.sockets;
    return [];
}

ChatService.prototype._getSockets = function (userIds) {
    var self = this;
    var sockets = [];
    if (userIds) {
        userIds.forEach((userId, index) => {
            sockets = sockets.concat(self._getUserSockets(userId));
        });
    }
    return sockets;
}

ChatService.prototype._send = function (sockets, data) {
    //Text,Image,File,TypingStatusMessage
    var messageType = data.messageType;
    var content = data.content;
    console.log("data", data);
    if (sockets) {
        console.log(sockets.length)
        sockets.forEach(socket => {
            socket.emit("receivedMsg", data);
        });
    }
}

ChatService.prototype._getTargetIds = function (conversationType, targetId) {
    var self = this;
    var targets = [];
    switch (conversationType) {
        case "PRIVATE":
            targets.push(targetId);
            break;
        case "GROUP":
            targets = targets.concat(self._getGroupMembers(targetId));
            break;
    }
    return targets;
}

/**
 * 获取群组成员
 */
ChatService.prototype._getGroupMembers = function (groupId) {
    return [];
}

module.exports = ChatService;