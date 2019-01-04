function ResultMessage() {
    var self = this;
    self.code = 0;
    self.msg = "";
    return self;
}

ResultMessage.prototype.ok = function (obj) {
    var self = this;
    self.code = 0;
    self.msg = obj;
    return self;
};

ResultMessage.prototype.error = function (...params) {
    var self = this;
    if (!params) {
        self.code = 500;
        self.msg = "未知异常，请联系管理员！";
    }
    var iLen = params.length;
    switch (iLen) {
        case 1:
            self.code = 500;
            self.msg = params[0];
            break;
        case 2:
            self.code = params[0];
            self.msg = params[1];
            break;
        default:
            break;
    }
    return self;
};

ResultMessage.prototype.toString = function () {
    var self = this;
    return JSON.stringify(self.jsonObj);
};

module.exports = ResultMessage;