import React from 'react';
import { toJS } from 'mobx';
import { observer, inject } from "mobx-react";
import ChatMessages from './ChatMessages';

@observer // 监听当前组件
export default class ChatDialogWin extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            content: ''
        };
    }

    _handleEnterKey = (e) => {
        if (e.ctrlKey && e.keyCode === 13) {
            this._sendMessage();
        }
    }

    componentDidMount() {
        document.addEventListener("keydown", this._handleEnterKey);
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this._handleEnterKey);
    }

    _sendMessage = () => {
        var { target, store } = this.props;
        var { content } = this.state;
        if (content.length == 0) {
            alert("请输入消息!");
            this.refs.input.focus();
            return;
        }
        var { targetId, conversationType } = target;

        var messageType = "TextMessage";
        this.setState({
            content: ''
        });

        store.sendMessage(targetId, conversationType, messageType, content);
    }

    _inputChange = (e) => {
        var { target, store } = this.props;
        this.setState({
            content: e.target.value
        });
        store.typing();
    }

    render() {
        var { target, store } = this.props;
        return (
            <div className="win">
                <div className="header">
                    :) {target.targetName}
                </div>
                <div className="messages">
                    <ChatMessages store={store} />
                </div>
                <div className="control"></div>
                <div className="input">
                    <textarea ref={"input"} placeholder="在此处输入消息..." onChange={this._inputChange} value={this.state.content}></textarea>
                    <div className="btn">
                        <input onClick={this._sendMessage} type="button" value="发送消息" />
                    </div>
                </div>
            </div>
        );
    }
}