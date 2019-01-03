import React from 'react';
import { observer, inject } from "mobx-react";
import * as style from '../styles/app.css';

import ChatContacts from './ChatContacts';
import ChatDialog from './ChatDialog';

@observer // 监听当前组件
export default class ChatWinMain extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            store: this.props.store
        };
    }

    render() {
        return (
            <div className="main">
                <ChatContacts store={this.state.store} />
                <ChatDialog store={this.state.store} />
            </div>
        );
    }
}