import React from 'react';
import { observer, inject } from "mobx-react";
import wrapper from './wrapper';

@observer // 监听当前组件
@wrapper
export default class Setting extends React.Component {
    constructor(props) {
        super(props);
    }

    _logout = () => {
        var { store } = this.props;
        if (confirm("确定要退出吗？"))
            store.logout();
    }

    render() {
        var { store } = this.props;
        return (
            <div className="setting-window">
                <div className="header">
                    设置
                </div>
                <div className="body">
                    <div className="update">
                        <div className="label">修改：</div>
                        <div className="password">
                            <input type="button" value="密码" />
                        </div>
                        <div className="alias">
                            <input type="button" value="昵称" />
                        </div>
                        <div className="icon">
                            <input type="button" value="图像" />
                        </div>
                    </div>
                    <div className="logout" onClick={this._logout}>
                        退出登录
                    </div>
                </div>
                <div className="footer">
                    <div className="cancel" onClick={() => {
                        this.props.onCancel && this.props.onCancel();
                    }}>取消</div>
                </div>
            </div>
        );
    }
}