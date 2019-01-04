import React from 'react';
import { observer, inject } from "mobx-react";

@observer // 监听当前组件
export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            store: this.props.store
        };
    }

    render() {
        var { store } = this.state;
        var { userId, password } = store;
        return (
            <div className="login-window">
                <div className="login-form">
                    <div className="header">HiChat! :)</div>
                    <div className="input">
                        <input type="text" value={userId} placeholder="请输入用户名"
                            onChange={(e) => {
                                store.userId = e.target.value;
                            }}
                        />
                    </div>
                    <div className="input">
                        <input type="password" value={password} placeholder="请输入密码"
                            onChange={(e) => {
                                store.password = e.target.value;
                            }}
                        />
                    </div>
                    <div className="btn">
                        <input type="button" value="登录" onClick={() => {
                            store.login();
                        }} />
                    </div>
                </div>
            </div>
        );
    }
}