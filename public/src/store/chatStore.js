import { observable, action, computed, observe, extendObservable, autorun, toJS } from "mobx";
import io from 'socket.io-client';

class ChatStore {
    @observable appKey = "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX";
    @observable userName = "zhanqun";
    @observable passCode = "zhanqun";
    @observable connected = false;
    @observable logined = false;
    @observable token = '';
    @observable friends = [];
    @observable groups = [];
    @observable friendHistory = [];
    @observable groupHistory = [];

    @observable socket = undefined;
    @observable selectedTarget = undefined;
    constructor() {
        this.socket = io.connect('http://localhost:3000/' + this.appKey, {});
        this._connect();
    }

    _connect = () => {
        var self = this;
        var socket = self.socket;
        socket.on('connect', function () {
            console.log('connected to server++++++++++++++++');
            self.connected = true;
        });
        socket.on("receivedMsg", self._receivedMsg);
        socket.on("newSignIn", self._newSignIn);
        socket.on("disconnect", () => {
            self.connected = false;
        });
    }

    _getTarget = (data) => {
        var self = this;
        var target = undefined;
        switch (data.conversationType) {
            case "PRIVATE": {
                target = self.friendHistory.find((friend) => {
                    return (data.from.userName == self.userName && friend.targetId == data.targetId) || friend.targetId == data.from.userName;
                });
                break;
            }
            case "GROUP": {
                target = self.groupHistory.find((group) => {
                    return group.targetId == data.targetId;
                });
                break;
            }
        }
        return target;
    }

    _receivedMsg = (data) => {
        var self = this;
        if (self.connected && self.logined) {
            var target = self._getTarget(data);
            console.log("receivedMsg", data, target);
            var direction = self.userName == data.from.userName ? "SEND" : "RECEIVE";//RECEIVE->接收，SEND->发送
            data.direction = direction;
            switch (data.conversationType) {
                case "PRIVATE": {
                    var targetId = direction == "RECEIVE" ? data.from.userName : data.targetId;
                    if (!target) {
                        self.friendHistory.push({
                            targetId: targetId,
                            history: [data]
                        });
                    }
                    else
                        target.history.push(data);

                    //console.log("PRIVATE", target);
                    break;
                }
                case "GROUP": {
                    data.direction = direction;
                    if (!target) {
                        self.groupHistory.push({
                            targetId: data.targetId,
                            history: [data]
                        });
                    }
                    else
                        target.history.push(data);

                    //console.log("GROUP", target);
                    break;
                }
            }
        }
    }

    _newSignIn = (data) => {
        var self = this;
        if (self.connected && self.logined && self.userName != data.userName) {
            //console.log("_newSignIn", data);
            self.friends.push(data);
        }
    }

    @action
    login = () => {
        var self = this;
        self.socket.emit('user/signIn', { userName: self.userName, passCode: self.passCode }, function (data) {
            self.logined = !!data.token;
            self.token = data.token;
            self.friends = self.friends.concat(data.friends);
        });
    }

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

    @computed
    get groupList() {
        var newData = [];
        this.groups.forEach(group => {
            var _group = { ...group, targetId: group.groupId, targetName: group.groupName, conversationType: "GROUP" }
            newData.push(_group);
        });
        return newData;
    }

    @computed
    get friendList() {
        var newData = [];
        this.friends.forEach(friend => {
            var _friend = { ...friend, targetId: friend.userName, targetName: friend.userName, conversationType: "PRIVATE" }
            newData.push(_friend);
        });
        return newData;
    }

    @computed
    get contacts() {
        //console.log("friendList", toJS(this.groupList))
        return [].concat(this.groupList, this.friendList);
    }

    @computed
    get selectedHistory() {
        var target = this.selectedTarget;
        var messages = [];
        //console.log("target", target)
        if (!target)
            return messages;
        switch (target.conversationType) {
            case "PRIVATE":
                var targetObj = this.friendHistory.find(friend => {
                    return friend.targetId == target.userName;
                });
                if (targetObj)
                    messages = targetObj.history;
                break;
            case "GROUP":
                var targetObj = this.groupHistory.find(group => {
                    return group.targetId == target.groupId;
                });
                if (targetObj)
                    messages = targetObj.history;
                break;
        }
        //console.log("messages", messages);
        return messages;
    }
}

const chatStore = new ChatStore();

export { chatStore };