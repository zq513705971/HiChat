import React from 'react';
import { toJS } from 'mobx';
import { observer, inject } from "mobx-react";
import Utils from '../utils/Utils';

@observer // 监听当前组件
export default class ChatMessage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        var { message, store } = this.props;
        var { sender } = message;
        //console.log(message.content)
        return (
            <div className="msg">
                <div className="time">{new Date(message.time).toLocaleString()}</div>
                <div className={["line", message.direction].join(' ')}>
                    <div className="block">
                        <div className="image">
                            <img src={sender.image || require("../images/temp.png")} className="icon" />
                        </div>
                        <div className="msg-content">
                            <div className="name">
                                {sender.targetName}
                            </div>
                            <div className="info" dangerouslySetInnerHTML={{ __html: Utils.htmlEncode(message.content) }}>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}