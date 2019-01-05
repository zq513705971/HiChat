let ChatData = {
    getAppkeys: function () {
        return ["XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"];
    },
    getUsers: function (appKey) {
        return [
            {
                //     userId: "zhanqun01",
                //     name: "詹群01",
                //     password: "zhanqun",
                //     image: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1546672561909&di=67ec85e227cb7d04b52cdea2bae18f56&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201511%2F23%2F20151123133923_cZKPB.jpeg",
                //     friends: this.getFriends(appKey, "zhanqun01")
                // },
                // {
                //     userId: "zhanqun02",
                //     name: "詹群02",
                //     password: "zhanqun",
                //     friends: this.getFriends(appKey, "zhanqun02")
                // }, {
                //     userId: "zhanqun03",
                //     name: "詹群03",
                //     password: "zhanqun",
                //     friends: this.getFriends(appKey, "zhanqun03")
                // }, {
                //     userId: "zhanqun04",
                //     name: "詹群04",
                //     password: "zhanqun",
                //     friends: this.getFriends(appKey, "zhanqun04")
                // }, {
                //     userId: "zhanqun05",
                //     name: "詹群05",
                //     password: "zhanqun",
                //     friends: this.getFriends(appKey, "zhanqun05")
                // }, {
                //     userId: "zhanqun06",
                //     name: "詹群06",
                //     password: "zhanqun",
                //     friends: this.getFriends(appKey, "zhanqun06")
                // }, {
                //     userId: "zhanqun07",
                //     name: "詹群07",
                //     password: "zhanqun",
                //     friends: this.getFriends(appKey, "zhanqun07")
                // }, {
                //     userId: "zhanqun08",
                //     name: "詹群08",
                //     password: "zhanqun",
                //     friends: this.getFriends(appKey, "zhanqun08")
                // }, {
                //     userId: "zhanqun09",
                //     name: "詹群09",
                //     password: "zhanqun",
                //     friends: this.getFriends(appKey, "zhanqun09")
                // }, {
                userId: "zhanqun",
                name: "詹群",
                password: "zhanqun",
                image: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1546672561909&di=67ec85e227cb7d04b52cdea2bae18f56&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201511%2F23%2F20151123133923_cZKPB.jpeg",
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
        //var userIds = ["zhanqun01", "zhanqun02", "zhanqun03", "zhanqun04", "zhanqun05", "zhanqun06", "zhanqun07", "zhanqun08", "zhanqun09", "zhanqun", "admin", "smallbyte"];
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