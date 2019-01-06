import React from 'react';
import { toJS } from 'mobx';
import { observer, inject } from "mobx-react";
import ChatMessages from './ChatMessages';
import GroupMembers from './GroupMembers';

@observer // 监听当前组件
export default class ChatDialogWin extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            content: '',
            showMembers: false
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
        var { store } = this.props;
        this.setState({
            content: e.target.value
        });
        store.typing();
    }

    render() {
        var { target, store } = this.props;
        var { showMembers } = this.state;
        var { isTyping } = store;
        //console.log(target.conversationType)
        return (
            <div className="win">
                <div className="header">
                    <img src={target.image || require("../images/temp.png")} className="icon" />
                    <div className="name">
                        :) {target.targetName}
                        <div className="typing">{
                            isTyping ? "正在输入..." : ""
                        }</div>
                    </div>
                    {
                        target.conversationType == "GROUP" ?
                            <div className="member"
                                onClick={() => {
                                    this.setState({
                                        showMembers: !this.state.showMembers
                                    });
                                }}
                                onMouseOver={() => {
                                    this.setState({
                                        showMembers: true
                                    });
                                }}
                                onMouseOut={() => {
                                    // this.setState({
                                    //     showMembers: false
                                    // });
                                }}
                            >
                                <img src={require("../images/members.png")} className="icon" />
                            </div> :
                            <div></div>
                    }
                </div>
                <div className="messages">
                    <ChatMessages store={store} />
                    {
                        showMembers ? <GroupMembers store={store} target={target} /> : undefined
                    }
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