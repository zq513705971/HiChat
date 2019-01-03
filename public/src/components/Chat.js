import React from 'react';
import { observer, inject } from "mobx-react";
import * as style from '../styles/app.css';
import ChatWinHeader from './ChatWinHeader';
import ChatWinMain from './ChatWinMain';

@observer // 监听当前组件
export default class Chat extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        var store = this.props.store;
        return (
            <div className="chat-window">
                <div className="chat-container">
                    <ChatWinHeader store={store} />
                    <ChatWinMain store={store} />
                </div>
            </div>
        );
    }
}