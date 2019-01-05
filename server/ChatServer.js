let Utils = require('./Utils');
let ResultMessage = require("./ResultMessage");

function ChatServer(io, appKey, initData) {
    this.io = io;
    this.appKey = appKey;
    //key ->userId,value->用户信息，用户已连接sockets
    this.userInfos = new Map();
    //key ->groupId,value->群组名称、成员列表
    this.groupInfos = new Map();
    //sockets->用于移除断开连接的用户socket
    this.sockets = new Map();
    //用于存储发送的消息，私聊为Private-UserId，群聊-GroupId
    this.history = new Map();
    if (initData) {
        //初始化存储结构
        (initData.users || []).forEach(user => {
            this.userInfos.set(user.userId, {
                ...user,
                token: Utils.guid(),
                sockets: []
            });
        });
        (initData.groups || []).forEach(group => {
            this.groupInfos.set(group.groupId, {
                ...group
            });
        });
    }
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
        socket.on("sendMsg", (data) => {
            self._sendMsg(socket, data);
        });
        socket.on("typing", (data) => {
            self._typing(socket, data);
        });
        socket.on("disconnect", () => self._disconnect(socket));
    });
}

ChatServer.prototype._typing = function (socket, data) {
    var self = this;
    var userIds = self._getTargetIds(data.conversationType, data.targetId);
    var sockets = self._getSockets(userIds);
    var userId = self.sockets.get(socket);
    userInfo = self.userInfos.get(userId);

    var info = { ...data, from: self._getUserInfo(userId) };
    sockets && sockets.forEach(_socket => {
        _socket.emit("onTyping", info);
    });
}

/**
 * 获取好友列表
 */
ChatServer.prototype._getFriends = function (userId) {
    var self = this;
    var userInfo = self.userInfos.get(userId);
    return userInfo.friends;
}

ChatServer.prototype._getUserGroups = function (userId) {
    var self = this;
    var groupIds = [];
    self.groupInfos.forEach((groupInfo, groupId) => {
        var members = groupInfo.members || [];
        if (members.indexOf(userId) >= 0)
            groupIds.push(groupId);
    });
    return groupIds;
}

/**
 * 获取好友列表和群组列表
 */
ChatServer.prototype._getConversations = function (userId) {
    var self = this;
    var friends = self._getFriends(userId);
    var groups = self._getUserGroups(userId);

    var conversations = [];
    (friends || []).forEach(friend => {
        var conversationType = "PRIVATE";
        conversations.push({
            ...self._getUserInfo(friend),
            conversationType: conversationType,
            historys: this._getHistoryMessages(conversationType, userId, friend),
            recent: self._getTargetRecentMessage(conversationType, userId, friend)
        });
    });
    (groups || []).forEach(group => {
        var conversationType = "GROUP";
        conversations.push({
            ...self._getGroupInfo(group),
            conversationType: conversationType,
            historys: this._getHistoryMessages(conversationType, userId, group),
            recent: self._getTargetRecentMessage(conversationType, userId, group)
        });
    });
    return conversations;
}

ChatServer.prototype._getUserInfo = function (userId) {
    var self = this;
    var userInfo = undefined;
    if (self.userInfos.has(userId)) {
        userInfo = self.userInfos.get(userId);
        return { targetId: userId, targetName: userInfo.name, image: userInfo.image };
    }
    return {};
}


ChatServer.prototype._getGroupInfo = function (groupId) {
    var self = this;
    var groupInfo = undefined;
    if (self.groupInfos.has(groupId)) {
        groupInfo = self.groupInfos.get(groupId);
        return { targetId: groupId, targetName: groupInfo.name };
    }
    return {};
}

/**
 * 用户登录
 */
ChatServer.prototype._signIn = function (socket, user, callback) {
    var self = this;
    var userInfo = undefined;
    //console.log(user, self.userInfos);
    if (self.userInfos.has(user.userId))
        userInfo = self.userInfos.get(user.userId);
    else {
        callback && callback(new ResultMessage().error("该用户不存在！"));
        return;
    }
    if (userInfo.userId == user.userId && userInfo.password == user.password) {
        userInfo.sockets.push(socket);
        self.sockets.set(socket, userInfo.userId);

        var conversations = self._getConversations(userInfo.userId);
        callback && callback(new ResultMessage().ok({ ...self._getUserInfo(userInfo.userId), token: userInfo.token, conversations }));
        self._newSignInNotification(userInfo.userId);
    } else {
        callback && callback(new ResultMessage().error("请确认密码是否正确！"));
        return;
    }
}

/**
 * 向好友发送已登录通知
 */
ChatServer.prototype._newSignInNotification = function (userId) {
    var self = this;
    var friendUserIds = self._getFriends(userId);
    var sockets = self._getSockets(friendUserIds);
    sockets.forEach(socket => {
        socket.emit("newSignIn", self._getUserInfo(userId));
    });
}

/**
 * 注册
 */
ChatServer.prototype._signUp = function (user, callback) {
    var self = this;
    if (self.userInfos.has(user.userId)) {
        callback && callback(new ResultMessage().error("已存在该用户，请重新输入！"));
        return;
    }
    this.userInfos.set(user.userId, {
        ...user,
        token: Utils.guid(),
        sockets: []
    });
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

    console.log(userInfo.userId + "-disconnect-" + sockets.length);
}

/**
 * 获取群组成员userId列表
 */
ChatServer.prototype._getGroupMembers = function (groupId) {
    var self = this;
    var groupInfo = self.groupInfos.get(groupId);
    if (groupInfo && groupInfo.members)
        return groupInfo.members;
    return [];
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
            targets = targets.concat(self._getGroupMembers(targetId));
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
    if (!self.history.has(key))
        self.history.set(key, []);

    var history = self.history.get(key);
    history.push(data);
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
    return self.history.get(key);
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
        if (userIds.indexOf(userInfo.userId) == -1) {
            userIds.push(userInfo.userId);
        }
        var sockets = this._getSockets(userIds);
        data = { ...data, time: new Date().getTime(), from: userId, sender: self._getUserInfo(userId), messageId: Utils.guid() };

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