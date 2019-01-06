let Utils = require('../public/src/utils/Utils');
let ResultMessage = require("./ResultMessage");
let ChatData = require('./ChatData');

function ChatServer(io, appKey) {
    this.io = io;
    this.appKey = appKey;
    //key ->userId,value->用户信息，用户已连接sockets
    this.userInfos = new Map();
    //sockets->用于移除断开连接的用户socket
    this.sockets = new Map();

    var users = ChatData.getUsers(this.appKey);
    //初始化存储结构
    (users || []).forEach(user => {
        this.userInfos.set(user.userId, {
            token: Utils.guid(),
            sockets: []
        });
    });
}

/**
 * 初始化服务
 */
ChatServer.prototype.init = function () {
    var self = this;
    //console.log(this);
    self.io && self.io.of(self.appKey).on('connection', function (socket) {
        console.log('a user connected');

        socket.on("user/signIn", (user, callback) => {
            self._signIn(socket, user, callback);
        });
        socket.on("user/signUp", (user, callback) => {
            self._signUp(user, callback);
        });
        socket.on("groupMembers", (group, callback) => {
            self._getGroupMembers(group, callback);
        });
        socket.on("sendMsg", (data) => {
            self._sendMsg(socket, data);
        });
        socket.on("typing", (data) => {
            self._typing(socket, data);
        });
        socket.on("disconnect", () => self._disconnect(socket));
    });
}

ChatServer.prototype._getGroupMembers = function (group, callback) {
    var self = this;
    var userIds = ChatData.getGroupMembers(self.appKey, group.groupId);
    var userInfos = [];
    if (userIds) {
        userIds.forEach(userId => {
            userInfos.push({
                ...ChatData.getUserInfo(self.appKey, userId)
            });
        });
    }
    callback && callback(new ResultMessage().ok(userInfos));
}

ChatServer.prototype._typing = function (socket, data) {
    var self = this;
    var userIds = self._getTargetIds(data.conversationType, data.targetId);
    var sockets = self._getSockets(userIds);
    var userId = self.sockets.get(socket);
    var info = { ...data, from: ChatData.getUserInfo(self.appKey, userId) };
    sockets && sockets.forEach(_socket => {
        _socket.emit("onTyping", info);
    });
}

/**
 * 获取好友列表和群组列表
 */
ChatServer.prototype._getConversations = function (userId) {
    var self = this;
    var friends = ChatData.getFriends(self.appKey, userId);
    var groups = ChatData.getUserGroups(self.appKey, userId);

    var conversations = [];
    (friends || []).forEach(friend => {
        var conversationType = "PRIVATE";
        conversations.push({
            ...ChatData.getUserInfo(self.appKey, friend),
            conversationType: conversationType,
            historys: this._getHistoryMessages(conversationType, userId, friend),
            recent: self._getTargetRecentMessage(conversationType, userId, friend)
        });
    });
    (groups || []).forEach(group => {
        var conversationType = "GROUP";
        conversations.push({
            ...ChatData.getGroupInfo(self.appKey, group),
            conversationType: conversationType,
            historys: this._getHistoryMessages(conversationType, userId, group),
            recent: self._getTargetRecentMessage(conversationType, userId, group)
        });
    });
    return conversations;
}

/**
 * 用户登录
 */
ChatServer.prototype._signIn = function (socket, user, callback) {
    var self = this;
    //console.log(user);
    if (!ChatData.checkUser(user.userId, user.password, (msg) => {
        callback && callback(new ResultMessage().error(msg));
        return;
    })) {
        var userInfo = self.userInfos.get(user.userId);
        userInfo.sockets.push(socket);
        self.sockets.set(socket, user.userId);
        var conversations = self._getConversations(user.userId);
        callback && callback(new ResultMessage().ok({ ...ChatData.getUserInfo(self.appKey, user.userId), token: userInfo.token, conversations }));
        self._newSignInNotification(user.userId);
    }
}

/**
 * 向好友发送已登录通知
 */
ChatServer.prototype._newSignInNotification = function (userId) {
    var self = this;
    var friendUserIds = ChatData.getFriends(self.appKey, userId);
    var sockets = self._getSockets(friendUserIds);
    sockets.forEach(socket => {
        socket.emit("newSignIn", ChatData.getUserInfo(self.appKey, userId));
    });
}

/**
 * 注册
 */
ChatServer.prototype._signUp = function (user, callback) {
    var self = this;
    var userInfo = ChatData.getUserInfo(self.appKey, user.userId);
    if (userInfo) {
        callback && callback(new ResultMessage().error("已存在该用户，请重新输入！"));
        return;
    }
    this.userInfos.set(user.userId, {
        token: Utils.guid(),
        sockets: []
    });
    ChatData.joinUser(self.appKey, user);
    ChatData.joinAppGroup(self.appKey, user.userId);
    callback && callback(new ResultMessage().ok("注册成功！"));
}

/**
 * 断开连接
 * 移除userInfo下和this.sockets中的socket
 */
ChatServer.prototype._disconnect = function (socket) {
    var self = this;
    var userId = self.sockets.get(socket);
    userInfo = self.userInfos.get(userId);
    if (!userInfo)
        return;

    var sockets = userInfo.sockets;
    var index = sockets.indexOf(socket);
    if (index >= 0)
        sockets.splice(index, 1);
    self.sockets.delete(socket);

    console.log(userId + "-disconnect-" + sockets.length);
}

/**
 * 向会话对象发送消息
 * Private ->私聊
 * Group ->群聊
 */
ChatServer.prototype._getTargetIds = function (conversationType, targetId) {
    var self = this;
    var targets = [];
    switch (conversationType) {
        case "PRIVATE":
            targets.push(targetId);
            break;
        case "GROUP":
            targets = targets.concat(ChatData.getGroupMembers(self.appKey, targetId));
            break;
    }
    return targets;
}

/**
 * 获取用户对应的已连接的socket
 * 一个人可对应多个连接
 */
ChatServer.prototype._getUserSockets = function (userId) {
    var self = this;
    var userInfo = self.userInfos.get(userId);
    if (userInfo)
        return userInfo.sockets;
    return [];
}

/**
 * 获取用户群组sockets
 */
ChatServer.prototype._getSockets = function (userIds) {
    var self = this;
    var sockets = [];
    if (userIds) {
        userIds.forEach((userId, index) => {
            sockets = sockets.concat(self._getUserSockets(userId));
        });
    }
    return sockets;
}

/**
 * 保存历史消息
 */
ChatServer.prototype._saveHistoryMessage = function (data) {
    var self = this;
    var targetId = data.targetId;
    //PRIVATE-私聊，GROUP-群组
    var conversationType = data.conversationType;

    var key = undefined;
    switch (conversationType) {
        case "GROUP":
            key = conversationType + '-' + targetId;
            break;
        case "PRIVATE": {
            key = conversationType + '-' + [data.from, data.targetId].sort().join("-");
        }
            break;
    }
    ChatData.saveHistory(self.appKey, key, data);
}

ChatServer.prototype._getTargetRecentMessage = function (conversationType, userId, targetId) {
    var historys = this._getHistoryMessages(conversationType, userId, targetId);
    if (historys && historys.length >= 1)
        return historys[historys.length - 1];
    return undefined;
}

ChatServer.prototype._getHistoryMessages = function (conversationType, userId, targetId) {
    var self = this;
    var key = undefined;
    switch (conversationType) {
        case "GROUP":
            key = conversationType + '-' + targetId;
            break;
        case "PRIVATE": {
            key = conversationType + '-' + [userId, targetId].sort().join("-");
        }
            break;
    }
    return ChatData.getHistorys(self.appKey, key);
}

ChatServer.prototype._sendMsg = function (socket, data) {
    var self = this;
    var userId = self.sockets.get(socket);
    userInfo = self.userInfos.get(userId);

    //conversationType=PRIVATE->私聊（userId），conversationType=GROUP->群组(groupId)
    var targetId = data.targetId;
    //PRIVATE-私聊，GROUP-群组
    var conversationType = data.conversationType;

    if (userInfo) {
        var userIds = this._getTargetIds(conversationType, targetId);
        if (userIds.indexOf(userId) == -1) {
            userIds.push(userId);
        }
        var sockets = this._getSockets(userIds);
        data = { ...data, time: new Date().getTime(), from: userId, sender: ChatData.getUserInfo(self.appKey, userId), messageId: Utils.guid() };

        self._saveHistoryMessage(data);
        self._send(sockets, data);
    }
}

/**
 * 往目标sockets发送数据
 */
ChatServer.prototype._send = function (sockets, data) {
    //Text,Image,File,TypingStatusMessage
    //var messageType = data.messageType;
    //var content = data.content;
    //console.log("data", data);
    if (sockets) {
        //console.log(sockets.length)
        sockets.forEach(socket => {
            socket.emit("receivedMsg", data);
        });
    }
}

module.exports = ChatServer;