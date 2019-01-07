import { observable, action, computed, observe, extendObservable, autorun, toJS } from "mobx";
import io from 'socket.io-client';

class ChatStore {
    @observable appKey = "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX";
    @observable loginedUser = {
        userId: "test",
        password: "test",
        name: undefined,
        image: undefined
    };
    @observable connected = false;
    @observable logined = false;
    @observable token = '';
    @observable conversations = [];

    @observable isTyping = false;
    @observable socket = undefined;
    @observable selectedTarget = undefined;
    constructor() {
        this._connect();
    }

    _reconnection = () => {
        var self = this;
        self.socket.disconnect();

        self._connect();
    }

    _connect = () => {
        var self = this;
        self.socket = io.connect('http://my.smallbyte.cn:3000/' + this.appKey, {});
        var socket = self.socket;
        //console.log(socket);
        socket.on('connect', function () {
            console.log('已链接到服务...');
            self.connected = true;
        });
        socket.on("receivedMsg", self._receivedMsg);
        socket.on("newSignIn", self._newSignIn);
        socket.on("onTyping", self._onTyping);
        socket.on("updateConversation", self._updateConversation);
        socket.on("disconnect", () => {
            console.log("与服务器间的链接已断开...");
            self.connected = false;
        });
    }

    _updateConversation = (obj) => {
        var self = this;
        var conversations = obj.conversations;
        (conversations || []).forEach(conversation => {
            if (conversation.conversationType == 'PRIVATE' && conversation.targetId == self.loginedUser.userId)
                return;
            var target = self._getConversationTarget(conversation.conversationType, conversation.targetId);
            if (!target)
                self.conversations.push(conversation);
        });
    }

    _onTyping = (data) => {
        var self = this;
        //console.log(self.selectedTarget, data);

        self.isTyping = self.selectedTarget && data.from && data.from.targetId == self.selectedTarget.targetId;
        if (self.isTyping) {
            setTimeout(() => {
                self.isTyping = false;
            }, 2000);
        }
    }

    _getConversationTarget = (conversationType, targetId) => {
        var self = this;
        var target = self.conversations.find((conversation) => {
            return conversation.conversationType == conversationType && conversation.targetId == targetId;
        });
        return target;
    }

    _getTarget = (data) => {
        var self = this;
        var target = undefined;
        switch (data.conversationType) {
            case "PRIVATE": {
                target = self._getConversationTarget(data.conversationType, data.from == self.loginedUser.userId ? data.targetId : data.from);
                break;
            }
            case "GROUP": {
                target = self._getConversationTarget(data.conversationType, data.targetId);
                break;
            }
        }
        return target;
    }

    _receivedMsg = (data) => {
        console.log("_receivedMsg", data);

        var self = this;
        if (self.connected && self.logined) {
            var target = self._getTarget(data);
            var direction = self.loginedUser.userId == data.from ? "send" : "receive";//RECEIVE->接收，SEND->发送
            data.direction = direction;

            if (!target.historys) {
                target.historys = [];
            }
            target.historys.push(data);
            target.recent = data;
        }
    }

    _newSignIn = (data) => { }

    @action
    _sendMsg = (data) => {
        var self = this;
        self.socket.emit("sendMsg", data);
    }

    @action
    sendMessage = (targetId, conversationType, messageType, content) => {
        var self = this;
        var data = {
            messageType: messageType,
            targetId: targetId,
            conversationType: conversationType,
            content: content
        };
        self._sendMsg(data);
    }

    @action
    selectTarget = (target) => {
        this.selectedTarget = target;
    }

    @action
    typing = () => {
        var self = this;
        var conversationType = this.selectedTarget.conversationType;
        var targetId = this.selectedTarget.targetId;
        self.socket.emit("typing", { conversationType, targetId });
    }

    @action
    getMembers = (groupId, callback) => {
        var self = this;
        self.socket.emit('groupMembers', { groupId }, function (result) {
            if (result.code == 0) {
                callback && callback(result.msg);
            }
            else
                alert(result.msg);
        });
    }

    @action
    login = () => {
        var self = this;
        self.logined = false;
        var loginedUser = self.loginedUser;
        loginedUser.name = undefined;
        loginedUser.image = undefined;
        self.socket.emit('user/signIn', { userId: loginedUser.userId, password: loginedUser.password }, function (result) {
            if (result.code == 0) {
                var data = result.msg;
                self.logined = !!data.token;
                self.token = data.token;
                loginedUser.image = data.image;
                loginedUser.name = data.targetName;
                self.conversations = self.conversations.concat(data.conversations);
                console.log(data);
            }
            else
                alert(result.msg);
        });
    }

    @action
    logout = () => {
        var self = this;
        self.conversations = [];
        self.token = undefined;
        self.logined = false;
        self.loginedUser.password = undefined;
        self.selectedTarget = undefined;
        self._reconnection();
    }

    @action
    register = (userId, name, password, callback) => {
        var self = this;
        self.socket.emit('user/signUp', { userId: userId, name: name, password: password }, function (result) {
            if (result.code == 0) {
                var data = result.msg;
                console.log(data);
                callback && callback();
            }
            alert(result.msg);
        });
    }

    @action
    addGroup = (name, callback) => {
        var self = this;
        self.socket.emit('addGroup', { name }, callback);
    }

    @action
    addFriend = (name, callback) => {
        var self = this;
        self.socket.emit('addFriend', { name }, function (msg) {
            if (msg)
                alert(msg);
            else
                callback && callback();
        });
    }

    @computed
    get historys() {
        var self = this;
        if (!self.selectedTarget)
            return [];
        var target = self._getConversationTarget(self.selectedTarget.conversationType, self.selectedTarget.targetId);
        if (target && target.historys) {
            var historys = [];
            target.historys.forEach(history => {
                //console.log(history);
                historys.push({ ...history, direction: history.from == self.loginedUser.userId ? "send" : "receive" });
            });
            return historys;
        }
        return [];
    }

    @computed
    get conversationsSorted() {
        return this.conversations.slice().sort((a, b) => {
            return (a.recent || { time: 0 }).time > (b.recent || { time: 0 }).time ? -1 : 1;
        });
    }
}

const chatStore = new ChatStore();

export { chatStore };