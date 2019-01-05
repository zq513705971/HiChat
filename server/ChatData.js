let ChatData = {
    getAppkeys: function () {
        return ["XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"];
    },
    getUsers: function (appKey) {
        return [
            {
                userId: "zhanqun",
                name: "詹群",
                password: "zhanqun",
                friends: this.getFriends(appKey, "zhanqun")
            },
            {
                userId: "smallbyte",
                name: "小字节",
                password: "smallbyte",
                friends: this.getFriends(appKey, "smallbyte")
            },
            {
                userId: "admin",
                name: "管理员",
                password: "admin",
                friends: this.getFriends(appKey, "admin")
            }
        ];
    },
    getFriends: function (appKey, userId) {
        var userIds = ["zhanqun", "admin", "smallbyte"];
        return userIds.filter(u => u != userId);
    },
    getGroups: function (appKey) {
        return [
            {
                groupId: "01",
                name: "测试群组",
                members: this.getGroupMembers(appKey, "01")
            }
        ];
    },
    getGroupMembers: function (appKey, groupId) {
        return ["zhanqun", "smallbyte", "admin"];
    },
    getHistorys: function (appKay, key) {
        //key: GROUP-groupId;PRIVATE-[userId,targetId].sort().join("-")
        return [];
    }
};

module.exports = ChatData;