var appData = [
    {
        key: "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
        groupId: "X000001",
        users: [
            {
                userId: "zhanqun",
                name: "詹群",
                password: "zhanqun",
                image: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1546672561909&di=67ec85e227cb7d04b52cdea2bae18f56&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201511%2F23%2F20151123133923_cZKPB.jpeg"
            },
            {
                userId: "smallbyte",
                name: "小字节",
                password: "smallbyte"
            },
            {
                userId: "admin",
                name: "管理员",
                password: "admin"
            }
        ],
        friends: [
            {
                userId: "zhanqun",
                list: ["admin", "smallbyte"]
            },
            {
                userId: "admin",
                list: ["zhanqun", "smallbyte"]
            },
            {
                userId: "smallbyte",
                list: ["zhanqun", "admin"]
            }
        ],
        groups: [
            {
                groupId: "X000001",
                name: "全体成员",
                image: "https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2030278735,2628483606&fm=26&gp=0.jpg"
            }
        ],
        members: [
            {
                groupId: "X000001",
                list: ["zhanqun", "smallbyte", "admin"]
            }
        ],
        historys: new Map()
    }
];

let ChatData = {
    getAppkeys: function () {
        var appKeys = [];
        for (const app in appData) {
            appKeys.push(appData[app].key);
        }
        return appKeys;
    },
    getAppInfo: function (appKey) {
        var appInfo = appData.find(app => {
            return app.key == appKey;
        })
        return appInfo;
    },
    getUsers: function (appKey) {
        var appInfo = this.getAppInfo(appKey);
        if (appInfo) {
            var users = [];
            (appInfo.users || []).forEach(user => {
                users.push({ ...user, friends: this.getFriends(appKey, user.userId) });
            });
            return users;
        }
        return [];
    },
    getUserInfo: function (appKey, userId) {
        var appInfo = this.getAppInfo(appKey);
        if (appInfo && appInfo.users) {
            var userInfo = appInfo.users.find(u => {
                return u.userId == userId;
            })
            if (userInfo)
                return { targetId: userId, targetName: userInfo.name, image: userInfo.image };
        }
        return undefined;
    },
    checkUser: function (appKey, userId, password, callback) {
        var appInfo = this.getAppInfo(appKey);
        if (appInfo && appInfo.users) {
            var userInfo = appInfo.users.find(u => {
                return u.userId == userId;
            })
            if (!userInfo) {
                callback && callback("不存在该用户！");
                return false;
            }
            if (userInfo.userId == userId && userInfo.password == password)
                return true;
            else {
                callback && callback("密码不正确！");
            }
        }
        return false;
    },
    joinUser: function (appKey, user) {
        var appInfo = this.getAppInfo(appKey);
        if (appInfo) {
            if (!appInfo.users)
                appInfo.users = [];
            appInfo.users.push(user);
        }
    },
    getFriends: function (appKey, userId) {
        var appInfo = this.getAppInfo(appKey);
        if (appInfo && appInfo.friends) {
            var userObj = appInfo.friends.find(user => {
                return user.userId == userId;
            })
            return userObj && userObj.list || [];
        }
        return [];
    },
    getGroups: function (appKey) {
        var appInfo = this.getAppInfo(appKey);
        var groups = [];
        if (appInfo && appInfo.groups) {
            (appInfo.groups || []).forEach(group => {
                groups.push({ ...group, members: this.getGroupMembers(appKey, group.groupId) });
            });
        }
        return [];
    },
    getGroupInfo: function (appKey, groupId) {
        var appInfo = this.getAppInfo(appKey);
        if (appInfo && appInfo.groups) {
            var groupInfo = (appInfo.groups || []).find(group => {
                return group.groupId == groupId;
            });
            if (groupInfo)
                return { targetId: groupId, targetName: groupInfo.name, image: groupInfo.image };
        }
        return undefined;
    },
    getGroupMembers: function (appKey, groupId) {
        var appInfo = this.getAppInfo(appKey);
        if (appInfo && appInfo.members) {
            var groupObj = appInfo.members.find(group => {
                return group.groupId == groupId;
            })

            var userIds = groupObj && groupObj.list || [];
            return userIds;
        }
        return [];
    },
    getUserGroups: function (appKey, userId) {
        var appInfo = this.getAppInfo(appKey);
        var groupIds = [];
        if (appInfo && appInfo.members) {
            (appInfo.members || []).forEach(group => {
                if ((group.list || []).indexOf(userId) >= 0)
                    groupIds.push(group.groupId);
            });
        }
        console.log(groupIds);
        return groupIds;
    },
    getHistorys: function (appKey, key) {
        //key: GROUP-groupId;PRIVATE-[userId,targetId].sort().join("-")
        var appInfo = this.getAppInfo(appKey);
        if (appInfo && appInfo.historys) {
            if (appInfo.historys.has(key))
                return appInfo.historys.get(key);
        }
        return [];
    },
    saveHistory: function (appKey, key, data) {
        var appInfo = this.getAppInfo(appKey);
        if (appInfo && appInfo.historys) {
            if (!appInfo.historys.has(key)) {
                appInfo.historys.set(key, [data]);
            } else {
                appInfo.historys.get(key).push(data);
            }
        }
    },
    joinAppGroup: function (appKey, userId) {
        var appInfo = appData.find(app => {
            return app.key == appKey;
        })
        appInfo && appInfo.groupId && this.joinGroup(appKey, appInfo.groupId, userId);
    },
    joinGroup: function (appKey, groupId, userId) {
        var appInfo = this.getAppInfo(appKey);
        if (appInfo && appInfo.members) {
            var groupObj = appInfo.members.find(group => {
                return group.groupId == groupId;
            })
            groupObj && groupObj.list && groupObj.list.push(userId);
        }
    }
};

module.exports = ChatData;