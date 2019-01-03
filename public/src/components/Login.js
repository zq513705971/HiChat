import React from 'react';
import { observer, inject } from "mobx-react";
import * as style from '../styles/app.css';

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
        var { logined, connected, userName, passCode } = store;
        return (
            <div className="login-window">
                <div className="login-form">
                    <div style={{ padding: 50, backgroundColor: "#ccc", borderRadius: 15 }}>
                        <h1>HiChat! :)</h1>
                        <div>
                            <input className="login-username" type="text" value={userName} placeholder="请输入用户名"
                                onChange={(e) => {
                                    store.userName = e.target.value;
                                }}
                            />
                        </div>
                        <div>
                            <input className="login-passcode" type="password" value={passCode} placeholder="请输入密码"
                                onChange={(e) => {
                                    store.passCode = e.target.value;
                                }}
                            />
                        </div>
                        <div>
                            <input className="login-submit" type="button" value="登录" onClick={() => {
                                store.login();
                            }} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}