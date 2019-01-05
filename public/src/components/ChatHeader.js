import React from 'react';
import { toJS } from 'mobx';
import { observer, inject } from "mobx-react";

@observer // 监听当前组件
export default class ChatHeader extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        var { store } = this.props;
        var { image, name } = store;
        return (
            <div className="chat-header">
                <div className="logo">
                    HiChat! :)
                </div>
                <div className="nav">
                    <div className="login-user">
                        <div className="name">{name}</div>
                        <img src={image || require("../images/temp.png")} className="icon" />
                    </div>
                </div>
            </div>
        );
    }
}