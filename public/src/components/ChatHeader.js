import React from 'react';
import { toJS } from 'mobx';
import { observer, inject } from "mobx-react";
import Setting from './Setting';

@observer // 监听当前组件
export default class ChatHeader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            setting: false
        };
    }

    _setting = () => {
        var { store } = this.props;
        this.setState({
            setting: true
        });
    }

    render() {
        var { store } = this.props;
        var { setting } = this.state;
        var { loginedUser } = store;
        return (
            <div className="chat-header">
                <div className="logo">
                    HiChat! :)
                </div>
                <div className="nav">
                    <div className="login-user">
                        <div className="name">{loginedUser.name}</div>
                        <img onClick={this._setting} src={loginedUser.image || require("../images/temp.png")} className="icon" />
                    </div>
                </div>
                {
                    setting ?
                        <Setting store={store} onCancel={() => {
                            this.setState({
                                setting: false
                            });
                        }} /> : undefined
                }
            </div>
        );
    }
}