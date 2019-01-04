import React from 'react';
import { toJS } from 'mobx';
import { observer, inject } from "mobx-react";

@observer // 监听当前组件
export default class ChatHeader extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="chat-header">
                HiChat! :)
            </div>
        );
    }
}