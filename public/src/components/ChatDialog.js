import React from 'react';
import { observer, inject } from "mobx-react";
import * as style from '../styles/app.css';
import ChatDialogMessages from './ChatDialogMessages';
import ChatDialogInput from './ChatDialogInput';
import ChatDialogControl from './ChatDialogControl';

@observer // 监听当前组件
export default class ChatDialog extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        var { store } = this.props;
        var { selectedTarget } = store;
        return (
            selectedTarget ?
                <div className="dialog">
                    <div className="dialog-header">
                        {
                            selectedTarget.targetName
                        }
                    </div>
                    <div className="dialog-content">
                        <ChatDialogMessages store={store} />
                        <ChatDialogControl store={store} />
                        <ChatDialogInput store={store} />
                    </div>
                </div> :
                <div className="dialog">
                    <div className="dialog-null"></div>
                </div>
        );
    }
}