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
            msg.direction == 'RECEIVE' ?
                <div className="message-item message-receive">
                    <div className="message-content">
                        {JSON.stringify(msg)}
                    </div>
                </div>
                :
                <div className="message-item message-send">
                    <div className="message-content">
                        {JSON.stringify(msg)}
                    </div>
                </div>
        );
    }
}