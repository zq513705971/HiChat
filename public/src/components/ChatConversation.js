import React from 'react';
import { toJS } from 'mobx';
import { observer, inject } from "mobx-react";
import ConversationItem from './ConversationItem';
import ChatSearchFriend from './ChatSearchFriend';
import ChatAddGroup from './ChatAddGroup';

@observer // 监听当前组件
export default class ChatConversation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showAddGroup: false,
            showSearchFriend: false
        };
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

    _showToAddGroup = () => {
        var { store } = this.props;
        this.setState({
            showAddGroup: true
        })
    }

    _showToAddFriend = () => {
        var { store } = this.props;
        this.setState({
            showSearchFriend: true
        })
    }

    render() {
        var { store } = this.props;
        var { showSearchFriend, showAddGroup } = this.state;
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
                <div className="tools">
                    <div className="addUser" title="添加好友" onClick={this._showToAddFriend}>
                        <img src={require("../images/addUser.png")} />
                    </div>
                    <div className="group" title="创建群组" onClick={this._showToAddGroup}>
                        <img src={require("../images/group.png")} />
                    </div>
                </div>
                {
                    showAddGroup ? <ChatAddGroup store={store} onComplate={(value) => {
                        store.addGroup(value, () => {
                            this.setState({
                                showAddGroup: false
                            });
                        })
                    }} onCancel={() => {
                        this.setState({
                            showAddGroup: false
                        });
                    }} /> : undefined
                }
                {
                    showSearchFriend ? <ChatSearchFriend store={store} onComplate={(value) => {
                        store.addFriend(value, () => {
                            //console.log("ok");
                            this.setState({
                                showSearchFriend: false
                            });
                        })
                    }} onCancel={() => {
                        this.setState({
                            showSearchFriend: false
                        });
                    }} /> : undefined
                }
            </div>
        );
    }
}