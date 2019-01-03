import React from 'react';
import { toJS } from 'mobx';
import { observer, inject } from "mobx-react";
import * as style from '../styles/app.css';
import ChatMessage from './ChatMessage';

@observer // 监听当前组件
export default class ChatDialogMessages extends React.Component {
    constructor(props) {
        super(props);

        //console.log("props", props);
    }

    render() {
        var { store } = this.props;
        var { selectedHistory } = store;
        //console.log("selectedHistory", selectedHistory);
        return (
            <div className="dialog-messages">
                {
                    selectedHistory && selectedHistory.map((msg, index) => {
                        return <ChatMessage msg={msg} key={msg.messageId} />
                    })
                }
            </div>
        );
    }
}