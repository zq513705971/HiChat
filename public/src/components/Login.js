import React from 'react';
import { observer, inject } from "mobx-react";
import Register from './Register';
import ForgetPassword from './ForgetPassword';

@observer // 监听当前组件
export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            store: this.props.store,
            register: false,
            forget: false
        };
    }

    _handleEnterKey = (e) => {
        var { register, forget } = this.state;
        if (e.keyCode === 13 && !register && !forget) {
            var { store } = this.state;
            store.login();
        }
    }

    componentDidMount() {
        document.addEventListener("keydown", this._handleEnterKey);
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this._handleEnterKey);
    }

    _register = () => {
        this.setState({
            register: true
        });
    }

    _forget = () => {
        this.setState({
            forget: true
        });
    }

    render() {
        var { store, register, forget } = this.state;
        var { loginedUser } = store;
        return (
            <div className="login-window">
                {
                    !register && !forget ?
                        <div className="login-form">
                            <div className="header">HiChat! :)</div>
                            <div className="input">
                                <input type="text" value={loginedUser.userId || ''} placeholder="请输入用户名"
                                    onChange={(e) => {
                                        loginedUser.userId = e.target.value;
                                    }}
                                />
                            </div>
                            <div className="input">
                                <input type="password" value={loginedUser.password || ''} placeholder="请输入密码"
                                    onChange={(e) => {
                                        loginedUser.password = e.target.value;
                                    }}
                                />
                            </div>
                            <div className="btn">
                                <input type="button" value="登录" onClick={() => {
                                    store.login();
                                }} />
                            </div>
                            <div className="other">
                                <div className="register" onClick={this._register}>注册</div>
                                <div className="forget" onClick={this._forget}>忘记密码</div>
                            </div>
                        </div> :
                        register ? <Register store={store} onClose={() => {
                            this.setState({
                                register: false
                            });
                        }} /> :
                            <ForgetPassword store={store} onClose={() => {
                                this.setState({
                                    forget: false
                                });
                            }} />
                }
            </div>
        );
    }
}