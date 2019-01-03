import React from 'react';
import { toJS } from 'mobx';
import { observer, inject } from "mobx-react";
import * as style from '../styles/app.css';

@observer // 监听当前组件
export default class ChatDialogControl extends React.Component {
    constructor(props) {
        super(props);

        console.log("props", props);
    }

    render() {
        var { store } = this.props;
        return (
            <div className="dialog-control">

            </div>
        );
    }
}