import React from 'react';
import { toJS } from 'mobx';
import { observer, inject } from "mobx-react";
import * as style from '../styles/app.css';

@observer // 监听当前组件
export default class ChatDialogInput extends React.Component {
    constructor(props) {
        super(props);

        console.log("props", props);
        this.state = {
            content: undefined
        };
    }

    _sendMessage = () => {
        var { store } = this.props;
        var { selectedTarget } = store;
        //console.log("selectedTarget", selectedTarget);
        var { content } = this.state;
        var { targetId, conversationType } = selectedTarget;

        var messageType = "TextMessage";
        this.setState({
            content: ''
        });

        store.sendMessage(targetId, conversationType, messageType, content);
    }

    _inputChange = (e) => {
        this.setState({
            content: e.target.value
        });
    }

    render() {
        var { store } = this.props;
        return (
            <div className="dialog-input">
                <textarea className="input-area" onChange={this._inputChange} value={this.state.content}></textarea>
                <div className="input">
                    <input onClick={this._sendMessage} className="submit-send" type="button" value="发送消息" />
                </div>
            </div>
        );
    }
}