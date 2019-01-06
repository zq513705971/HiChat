import React from 'react';
import { toJS } from 'mobx';
import { observer, inject } from "mobx-react";

@observer // 监听当前组件
export default class Register extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            userId: '',
            name: '',
            password: '',
            password2: ''
        };
    }

    _handleEnterKey = (e) => {
        if (e.keyCode === 13) {
            this._register();
        }
    }

    _register = () => {
        var { store } = this.props;
        var { userId, name, password, password2 } = this.state;
        if (password != password2) {
            alert("密码不一致，请重新输入!");
            return;
        }
        if (userId.length < 6 || password < 6) {
            alert("用户名和密码长度必须大于6，请重新输入!");
            return;
        }
        store.register(userId, name, password, () => {
            this.props.onClose && this.props.onClose();
        });
    }

    componentDidMount() {
        document.addEventListener("keydown", this._handleEnterKey);
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this._handleEnterKey);
    }

    render() {
        var { store } = this.props;
        var { userId, name, password, password2 } = this.state;
        return (
            <div className="register-form">
                <div className="header">
                    <div className="title">注册</div>
                    <div className="close" onClick={() => {
                        this.props.onClose && this.props.onClose();
                    }}>×</div>
                </div>
                <div className="block">
                    <div className="input">
                        <input type="text" placeholder="请输入用户名." value={userId} onChange={(e) => {
                            this.setState({
                                userId: e.target.value
                            });
                        }} />
                    </div>
                    <div className="input">
                        <input type="text" placeholder="请输入昵称." value={name} onChange={(e) => {
                            this.setState({
                                name: e.target.value
                            });
                        }} />
                    </div>
                    <div className="input">
                        <input type="password" placeholder="请输入密码." value={password} onChange={(e) => {
                            this.setState({
                                password: e.target.value
                            });
                        }} />
                    </div>
                    <div className="input">
                        <input type="password" placeholder="请输入确认密码." value={password2} onChange={(e) => {
                            this.setState({
                                password2: e.target.value
                            });
                        }} />
                    </div>
                    <div className="btn">
                        <input type="button" value="注册" onClick={() => {
                            this._register();
                        }} />
                    </div>
                </div>
            </div>
        );
    }
}