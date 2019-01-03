import React from 'react';
import { toJS } from 'mobx';
import { observer, inject } from "mobx-react";
import * as style from '../styles/app.css';
import ChatContactItem from './ChatContactItem';

@observer // 监听当前组件
export default class ChatContacts extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            store: this.props.store
        };
    }

    _renderConversations = () => {
        var { store } = this.state;
        var { contacts } = store;
        //console.log(contacts)
        return (
            contacts.map((data, index) => {
                return <ChatContactItem store={store} data={data} key={data.targetId} />
            })
        );
    }

    render() {
        return (
            <div className="contacts">
                <div className="contacts-header">
                    联系人
                </div>
                <div className="contacts-content">
                    {
                        this._renderConversations()
                    }
                </div>
            </div>
        );
    }
}