import React from 'react';
import { observer, inject } from "mobx-react";
import * as style from '../styles/app.css';

@observer // 监听当前组件
export default class ChatWinHeader extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            store: this.props.store
        };
    }

    render() {
        return (
            <div className="header">
                HiChat :)
            </div>
        );
    }
}