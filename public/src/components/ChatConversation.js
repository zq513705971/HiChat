import React from 'react';
import { toJS } from 'mobx';
import { observer, inject } from "mobx-react";
import ConversationItem from './ConversationItem';

@observer // 监听当前组件
export default class ChatConversation extends React.Component {
    constructor(props) {
        super(props);
    }

    _renderItem = (conversation) => {
        var { store } = this.props;
        //console.log("conversation", conversation);
        return (
            <ConversationItem key={conversation.conversationType + '-' + conversation.targetId} store={store} item={conversation} />
        );
    }

    _renderItems = (conversations) => {
        var self = this;
        return (
            <div className="list">
                {
                    conversations && conversations.length > 0 ?
                        conversations.map((conversation) => {
                            return self._renderItem(conversation);
                        }) :
                        <div className="none">
                            当前无会话消息！
                            </div>
                }
            </div>
        );
    }

    render() {
        var { store } = this.props;
        var { conversationsSorted } = store;
        //console.log(toJS(conversationsSorted))
        return (
            <div className="contacts">
                <div className="header">
                    会话列表
                </div>
                {
                    this._renderItems(conversationsSorted)
                }
            </div>
        );
    }
}