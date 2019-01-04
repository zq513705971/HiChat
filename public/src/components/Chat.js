import React from 'react';
import { observer, inject } from "mobx-react";
import ChatConversation from './ChatConversation';
import ChatDialog from './ChatDialog';
import ChatHeader from './ChatHeader';

@observer // 监听当前组件
export default class Chat extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        var store = this.props.store;
        return (
            <div className="chat-window">
                <ChatHeader store={store} />
                <div className="chat-main">
                    <ChatConversation store={store} />
                    <ChatDialog store={store} />
                </div>
            </div>
        );
    }
}