import React from 'react';
import { toJS } from 'mobx';
import { observer, inject } from "mobx-react";
import * as style from '../styles/app.css';

@observer // 监听当前组件
export default class ChatContactItem extends React.Component {
    constructor(props) {
        super(props);
    }

    _onSelect = () => {
        var { data, store } = this.props;
        store.selectTarget(data);
    }

    render() {
        var { data } = this.props;
        return (
            <div className="contact-item" onClick={this._onSelect}>
                {
                    data.targetName
                }
            </div>
        );
    }
}