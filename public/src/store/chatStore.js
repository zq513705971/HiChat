import { observable, action, computed, observe, extendObservable, autorun, toJS } from "mobx";
import io from 'socket.io-client';

class ChatStore {
    @observable appKey = "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX";
    @observable userId = "smallbyte";
    @observable password = "smallbyte";
    @observable connected = false;
    @observable logined = false;
    @observable token = '';
    @observable conversations = [];

    @observable socket = undefined;
    @observable selectedTarget = undefined;
    constructor() {
        this.socket = io.connect('http://localhost:3000/' + this.appKey, {});
        this._connect();
    }

    _connect = () => {
        var self = this;
        var socket = self.socket;
        console.log(socket);
        socket.on('connect', function () {
            console.log('已链接到服务...');
            self.connected = true;
        });
        socket.on("receivedMsg", self._receivedMsg);
        socket.on("newSignIn", self._newSignIn);
        socket.on("onTyping", self._onTyping);
        socket.on("disconnect", () => {
            console.log("与服务器间的链接已断开...");
            self.connected = false;
        });
    }

    _onTyping = (data) => {
        var self = this;
        //console.log(data);
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
                target = self._getConversationTarget(data.conversationType, data.from == self.userId ? data.targetId : data.from);
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
        //console.log("_receivedMsg", data);

        var self = this;
        if (self.connected && self.logined) {
            var target = self._getTarget(data);
            var direction = self.userId == data.from ? "send" : "receive";//RECEIVE->接收，SEND->发送
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
    login = () => {
        var self = this;
        self.logined = false;
        self.socket.emit('user/signIn', { userId: self.userId, password: self.password }, function (result) {
            if (result.code == 0) {
                var data = result.msg;
                self.logined = !!data.token;
                self.token = data.token;
                self.conversations = self.conversations.concat(data.conversations);
                console.log(data);
            }
            else
                alert(result.msg);
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
                historys.push({ ...history, direction: history.from == self.userId ? "send" : "receive" });
            });
            return historys;
        }
        return [];
    }
}

const chatStore = new ChatStore();

export { chatStore };