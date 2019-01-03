import React from 'react';
import { toJS } from 'mobx';
import { observer, inject } from "mobx-react";
import * as style from '../styles/app.css';

@observer // 监听当前组件
export default class ChatMessage extends React.Component {
    constructor(props) {
        super(props);

        //console.log("props", props);
    }

    render() {
        var { msg } = this.props;
        return (
            <div className="message-item">
                <div className="message-time">{new Date(msg.time).toLocaleString()}</div>
                {
                    msg.direction == 'RECEIVE' ?
                        <div className="message-block message-receive">
                            <div className="message-content">
                                <div className="message-target" title={msg.from.userName}>
                                    <img src={require("../images/temp.png")} className="message-icon" />
                                </div>
                                <div className="message-obj">
                                    <div className="message-header">
                                        {msg.from.userName}
                                    </div>
                                    <div className="message-info">
                                        {msg.content}
                                    </div>
                                </div>
                            </div>
                        </div> :
                        <div className="message-block message-send">
                            <div className="message-content">
                                <div className="message-obj">
                                    <div className="message-header">
                                        {msg.from.userName}
                                    </div>
                                    <div className="message-info">
                                        {msg.content}
                                    </div>
                                </div>
                                <div className="message-target" title={msg.from.userName}>
                                    <img src={require("../images/temp.png")} className="message-icon" />
                                </div>
                            </div>
                        </div>
                }
            </div>
        );
    }
}